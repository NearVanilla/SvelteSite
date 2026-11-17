# Leaderboards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Season 8 "Leaderboards" section (`/stats`) to the NearVanilla site that turns
players' vanilla statistics into ranked awards with medals, rebuilt daily from a stats export.

**Architecture:** A pure-TypeScript stats engine in `src/lib/stats/` reads an export folder and
computes rankings. A server-only module calls it once per build. Prerendered `+page.server.ts`
routes slice the result into static HTML. A cron script on the VPS refreshes the export and
rebuilds the existing nginx Docker image.

**Tech Stack:** SvelteKit 2.53 (adapter-static, prerender), Svelte 5 runes, TypeScript strict,
bun 1.x (`bun test`), Docker Compose (named build contexts), bash.

**Spec:** `docs/superpowers/specs/2026-11-17-leaderboards-design.md`. Read it before starting any
task.

## Global Constraints

- Svelte 5 runes only (`$props`, `$state`, `$derived`). No `export let` and no `$:`.
- Tabs, single quotes, no trailing commas, 100-character lines.
- Follow `.claude/rules/semantic_html.md`: landmarks, `<table>` for rankings, `<article>` for cards,
  native `<input type="search">`.
- Follow `.claude/rules/vanilla_css.md`: BEM class names, component `<style>` blocks, no inline
  `style=""`, no frameworks. Reuse the tokens in `src/app.css`.
- No runtime `dependencies`. The only new devDependency is `@types/bun`.
- The engine (`src/lib/stats/**`, excluding fixtures) imports nothing from `$app`, `$env`, `$lib`
  or Svelte. Use relative imports and `node:` built-ins only.
- **Nothing is copied from pdinklag/MinecraftStats:** no award ids, names, descriptions, icons or
  localisation strings. Don't open its localisation files while naming awards.
- Season scope is Season 8 only. Read only the 26.x layout (`players/stats`,
  `players/advancements`).
- Config defaults:
  - `inactiveDays: 7`
  - `minPlaytimeMinutes: 60`
  - `excludeOps: false`
  - `excludeBanned: true`
  - `excludeUuids: []`
  - `medalPoints: { gold: 4, silver: 2, bronze: 1 }`
  - `season: 'Season 8'`
- "Active" is measured from the export time (`updatedAt`), never from `Date.now()`.
- After any `.svelte` edit, run the Svelte MCP `svelte-autofixer` until it reports zero issues.
- Every task ends with `bun run check` and `bun run lint` passing.

## Review Focus

These cases aren't spelled out in the spec but are the most likely to bite. Each has a test in the
task named.

1. **Mid-write file.** A player's stats file is truncated because the server was writing it during
   the copy. Skip that player with a warning and let the build continue. Test in Task 2.
2. **Name change.** A player renamed during the season. Use the newest usercache copy's name, and
   build the slug from it. Test in Task 2.
3. **No playtime.** A player joined but has no `minecraft:play_time` key yet. Treat playtime as 0,
   exclude them through the minimum-playtime filter, and don't crash. Test in Task 4.
4. **Non-object entries in advancements.** The advancements file's top-level `"DataVersion": 4xxx`
   number is ignored by `criteriaCount`, not treated as an advancement. Test in Task 3.
5. **Build with no stats.** A production build with `STATS_DIR` unset succeeds even though the
   dynamic routes have no entries, and `/stats` shows the empty state. Checked in Task 11.

---

## File Structure

```
src/lib/stats/
├── types.ts            # shared types (Task 1)
├── config.ts           # StatsConfig + defaults (Task 1)
├── format.ts           # unit + date formatting (Task 1)
├── read.ts             # export folder → RawExport (Task 2)
├── readers.ts          # stat/sum/criteriaCount constructors + evaluate (Task 3)
├── compute.ts          # RawExport → Leaderboard (Task 4)
├── awards.ts           # award catalogue + category labels (Task 5)
├── *.test.ts           # bun tests next to each module
└── fixtures/export/    # dev sample export (Task 6)
src/lib/server/stats.ts # memoised getStats(), playerRef() (Task 6)
src/lib/assets/stats/avatar-fallback.svg (Task 7)
src/lib/components/stats/
├── StatsNav.svelte, PlayerAvatar.svelte, Medal.svelte, CategoryGlyph.svelte (Tasks 6–7)
src/routes/stats/
├── +layout.server.ts, +layout.svelte                       (Task 6)
├── +page.server.ts, +page.svelte                           (Task 7, overview)
├── awards/[id]/+page.server.ts, +page.svelte                (Task 8)
├── players/+page.server.ts, +page.svelte                    (Task 9)
├── players/[slug]/+page.server.ts, +page.svelte             (Task 9)
└── hall-of-fame/+page.server.ts, +page.svelte               (Task 10)
scripts/refresh-stats.sh (Task 11)
Modify: package.json, svelte.config.js, src/app.css, src/lib/components/Nav.svelte, Dockerfile,
        docker-compose.yml, README.md
```

---

### Task 1: Engine types, config, formatting, and test setup

**Files:**

- Modify: `package.json` (add `"test": "bun test src/lib"` and the devDependency `@types/bun`)
- Create: `src/lib/stats/types.ts`, `src/lib/stats/config.ts`, `src/lib/stats/format.ts`
- Test: `src/lib/stats/format.test.ts`

**Interfaces:**

- Produces (`types.ts`):
  ```ts
  export type Unit = 'count' | 'distance' | 'duration' | 'health';
  export type AwardCategory =
  	| 'mining'
  	| 'combat'
  	| 'travel'
  	| 'farming'
  	| 'crafting'
  	| 'building'
  	| 'misc';
  export type Medal = 'gold' | 'silver' | 'bronze';
  export type StatTable = Record<string, Record<string, number>>; // category → key → value
  export type Advancements = Record<string, unknown>; // raw file; entries may be non-objects
  export type Reader =
  	| { kind: 'stat'; category: string; key: string }
  	| { kind: 'sum'; category: string; keys: string[] }
  	| { kind: 'criteriaCount'; advancement: string };
  export interface Award {
  	id: string;
  	name: string;
  	description: string;
  	category: AwardCategory;
  	unit: Unit;
  	read: Reader;
  }
  export interface RawPlayer {
  	uuid: string;
  	stats: StatTable;
  	advancements: Advancements;
  	lastSeen: number;
  }
  export interface RawExport {
  	players: RawPlayer[];
  	names: Map<string, string>;
  	ops: Set<string>;
  	banned: Set<string>;
  	warnings: string[];
  }
  export interface MedalTally {
  	gold: number;
  	silver: number;
  	bronze: number;
  	points: number;
  }
  export interface Standing {
  	value: number;
  	rank: number | null;
  	medal: Medal | null;
  }
  export interface Player {
  	uuid: string;
  	name: string;
  	slug: string;
  	lastSeen: number;
  	playtimeTicks: number;
  	active: boolean;
  	standings: Record<string, Standing>;
  	medals: MedalTally;
  	hallRank: number | null;
  }
  export interface RankEntry {
  	uuid: string;
  	rank: number;
  	value: number;
  	medal: Medal | null;
  }
  export interface AwardResult {
  	award: Award;
  	ranking: RankEntry[];
  }
  export interface HallEntry {
  	uuid: string;
  	rank: number;
  	tally: MedalTally;
  }
  export interface PlayerRef {
  	uuid: string;
  	name: string;
  	slug: string;
  }
  export interface Leaderboard {
  	season: string;
  	updatedAt: number;
  	activeCount: number;
  	players: Player[];
  	awards: AwardResult[];
  	hallOfFame: HallEntry[];
  	warnings: string[];
  }
  ```
- Produces (`config.ts`): `interface StatsConfig { season: string; inactiveDays: number;
minPlaytimeMinutes: number; excludeOps: boolean; excludeBanned: boolean; excludeUuids: string[];
medalPoints: Record<Medal, number> }` and `const defaultConfig: StatsConfig`, using the values in
  Global Constraints.
- Produces (`format.ts`): `formatValue(value: number, unit: Unit): string`,
  `formatDate(ms: number): string`.

- [ ] **Step 1: Add the test runner.** Run `bun add -d @types/bun` and add the `test` script.
      Confirm that `bun run check` still passes with the new types.
- [ ] **Step 2: Write the failing tests** in `format.test.ts` (`import { describe, expect, test }
from 'bun:test'`):
  ```ts
  expect(formatValue(4210, 'count')).toBe('4,210');
  expect(formatValue(100, 'distance')).toBe('1 block');
  expect(formatValue(12_345, 'distance')).toBe('123 blocks'); // 100 cm = 1 block, rounded
  expect(formatValue(250_000, 'distance')).toBe('2.5 km'); // ≥1000 blocks → km, 1 dp
  expect(formatValue(14_400, 'duration')).toBe('12m'); // 20 ticks = 1 s
  expect(formatValue(108_000, 'duration')).toBe('1h 30m');
  expect(formatValue(3_816_000, 'duration')).toBe('2d 5h');
  expect(formatValue(20, 'health')).toBe('1 heart'); // tenths of HP; 20 = 1 heart
  expect(formatValue(205, 'health')).toBe('10 hearts'); // rounded
  expect(formatDate(Date.UTC(2026, 10, 17, 23, 30))).toBe('17 Nov 2026'); // en-GB, UTC
  ```
- [ ] **Step 3: Run `bun test src/lib/stats/format.test.ts`.** Expected: FAIL, because the
      module is missing.
- [ ] **Step 4: Implement `types.ts`, `config.ts` and `format.ts`.** Use
      `toLocaleString('en-GB')` for thousands separators, and `Intl.DateTimeFormat('en-GB', { day:
'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })`.
- [ ] **Step 5: Run `bun test src/lib`.** Expected: PASS. Then run `bun run check` and
      `bun run lint`, both clean.
- [ ] **Step 6: Commit.** Message: `feat(stats): engine types, config and formatting`.

### Task 2: Export reader

**Files:**

- Create: `src/lib/stats/read.ts`
- Test: `src/lib/stats/read.test.ts`

**Interfaces:**

- Consumes: `RawExport` and `RawPlayer` from Task 1.
- Produces: `readExport(dir: string): RawExport`. It is synchronous and uses `node:fs` and
  `node:path`.

**Behaviour:**

- **Player files:** read `players/stats/*.json` (the file name is the dashed UUID) and the matching
  `players/advancements/<uuid>.json`. If the advancements file is missing, use `{}`.
- **Last seen:** use `last-seen.json` (`{ [uuid]: epochMillis }`) when it has the UUID. Otherwise
  use the stats file's `mtimeMs`.
- **Names:** read `usercache/*.json`, each an array of `{ name, uuid, expiresOn }`. Process the
  files in ascending file-name order so that later files overwrite earlier ones. This builds
  `names`.
- **Ops and bans:** read `ops.json` and `banned-players.json` (arrays of `{ uuid }`) into sets.
  Either file may be missing.
- **Errors:**
  - Throw `Error` if `dir` doesn't exist, or if `players/stats` has no `.json` files. The message
    must include the path.
  - For a stats file that fails to parse, or has no `stats` object, skip that player and push a
    warning. Also print it with `console.warn`.

- [ ] **Step 1: Write the failing tests.** Each test builds a temporary directory with
      `mkdtempSync(join(tmpdir(), 'nv-stats-'))`, writes files into it, and sets mtimes with
      `utimesSync`.
  - `reads stats, advancements and names`: one player. Assert the stats value, the advancement
    criteria object and `names.get(uuid)`.
  - `newest usercache copy wins per uuid`: `usercache/2026-11-01.json` has `OldName` and
    `2026-11-10.json` has `NewName` for the same UUID → `'NewName'`. A UUID that is present only in
    the older file keeps its name. (Review Focus #2.)
  - `last-seen.json overrides mtime`: set mtime to `Date.UTC(2026, 0, 1)` and last-seen to
    `Date.UTC(2026, 10, 16)`. Assert the latter.
  - `falls back to mtime`: with no last-seen file, `lastSeen === mtime` to within 1000 ms.
  - `skips malformed file with a warning`: one valid player plus one file containing `{"stats":`.
    Expect `players.length === 1` and a warning whose text includes that file's UUID. (Review
    Focus #1.)
  - `throws on missing dir` and `throws when players/stats is empty`: use `expect(() =>
readExport(p)).toThrow(p)`.
  - `optional ops and bans`: when the files are absent, both sets are empty. When present, they
    contain the UUIDs.
- [ ] **Step 2: Run `bun test src/lib/stats/read.test.ts`.** Expected: FAIL.
- [ ] **Step 3: Implement `readExport`.**
- [ ] **Step 4: Run `bun test src/lib`.** Expected: PASS. Then `check` and `lint`.
- [ ] **Step 5: Commit.** Message: `feat(stats): read stats export folder`.

### Task 3: Award readers

**Files:**

- Create: `src/lib/stats/readers.ts`
- Test: `src/lib/stats/readers.test.ts`

**Interfaces:**

- Produces:
  - `stat(category: string, key: string): Reader`
  - `sum(category: string, keys: string[]): Reader`
  - `criteriaCount(advancement: string): Reader`
  - `evaluate(reader: Reader, player: RawPlayer): number`. A missing category or key counts as 0. `criteriaCount` counts the keys of `advancements[id].criteria`, and only when that entry is
    an object that has a `criteria` object. Anything else gives 0.

- [ ] **Step 1: Write the failing tests.**
  - `stat reads one value`: `stat('minecraft:killed', 'minecraft:breeze')` on `{
'minecraft:killed': { 'minecraft:breeze': 7 } }` gives 7.
  - `stat missing is 0`.
  - `sum adds listed keys only`: `sum('minecraft:mined', ['minecraft:short_grass',
'minecraft:tall_grass'])` over `{ short_grass: 3, tall_grass: 2, dirt: 50 }` (all with the
    `minecraft:` prefix) gives 5.
  - `criteriaCount counts criteria`:
    `{ 'minecraft:adventure/adventuring_time': { criteria: { 'minecraft:plains': '…',
'minecraft:desert': '…' }, done: false } }` gives 2.
  - `criteriaCount ignores non-object entries`: advancements `{ DataVersion: 4440 }` with
    `criteriaCount('DataVersion')` gives 0, and the missing advancement also gives 0. (Review
    Focus #4.)
- [ ] **Step 2: Run the tests.** Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run `bun test src/lib`.** Expected: PASS. Then `check` and `lint`.
- [ ] **Step 5: Commit.** Message: `feat(stats): award readers`.

### Task 4: Leaderboard computation

**Files:**

- Create: `src/lib/stats/compute.ts`
- Test: `src/lib/stats/compute.test.ts`

**Interfaces:**

- Consumes: `evaluate` (Task 3), `StatsConfig`/`defaultConfig` (Task 1), and the types.
- Produces: `computeLeaderboard(raw: RawExport, awards: Award[], config: StatsConfig):
Leaderboard`.

**Rules (from the spec):**

- **`updatedAt`** = the maximum `lastSeen` over all raw players.
- **Playtime:**
  - `playtimeTicks` = `stats['minecraft:custom']['minecraft:play_time']`, or 0 if absent.
  - A player is excluded entirely if `playtimeTicks < minPlaytimeMinutes * 1200`.
- **Other exclusions:**
  - players with no entry in `names`, with a warning;
  - banned players when `excludeBanned`;
  - ops when `excludeOps`;
  - any UUID in `excludeUuids`.
- **Active** = `updatedAt - lastSeen <= inactiveDays * 86_400_000`.
- **Ranking**, per award in catalogue order:
  - Only active players with a value greater than 0 are ranked.
  - Sort by value descending.
  - Use competition ranking: equal values share a rank, and the next rank skips (1, 1, 3).
  - Within the same rank, order by name, case-insensitively.
  - Medals go by rank number: 1 is gold, 2 is silver, 3 is bronze, anything else is `null`.
- **Visible awards:** `awards` contains only awards with at least one ranked entry.
- **Standings:** a player's `standings` covers only visible awards where that player's value is
  greater than 0. Inactive players get `rank: null` and `medal: null`.
- **Medals and Hall of Fame:**
  - `medals` tallies the player's medals, and `points` uses `medalPoints`.
  - `hallOfFame` lists players with more than 0 points, ranked by points with the same
    competition ranking and name ordering.
  - `hallRank` is the player's rank there, or `null`.
- **Slug:** lowercase the name, then remove every character outside `[a-z0-9_]`. If the result is
  empty, or two players produce the same slug, use the UUID for each of them.
- **Ordering:** `players` is sorted by name, case-insensitively, and includes inactive players.
  `activeCount` counts the active ones.

- [ ] **Step 1: Write the failing tests.** Use an in-memory `RawExport` with
      `T = Date.UTC(2026, 10, 17)` and `DAY = 86_400_000`. There is one award `breeze-bane` =
      `stat('minecraft:killed','minecraft:breeze')`, and a second award `nobody` that no active player
      has scored.

  | Player | lastSeen  | Playtime (ticks) | Breeze kills | Notes               |
  | ------ | --------- | ---------------- | ------------ | ------------------- |
  | Alice  | T         | 72 000           | 5            |                     |
  | bob    | T − 1 DAY | 100 000          | 5            |                     |
  | Carol  | T − 2 DAY | 100 000          | 3            |                     |
  | Dave   | T − 8 DAY | 100 000          | 99           | Scored `nobody` = 4 |
  | Erin   | T         | 71 999           | 50           |                     |
  | Frank  | T         | 100 000          | 80           | Banned              |
  | Gus    | T         | none             | 10           | No `play_time` key  |
  | Op     | T         | 100 000          | 1            | In `ops`            |
  - `breeze ranking uses shared ranks`: the ranking's `(name, rank, medal)` sequence is exactly
    `Alice 1 gold`, `bob 1 gold`, `Carol 3 bronze`, `Op 4 null`.
  - `inactive players are listed but unranked`: Dave has `active: false` and
    `standings['breeze-bane']` = `{ value: 99, rank: null, medal: null }`.
  - `hard filters`: Erin (below the playtime minimum), Frank (banned) and Gus (no playtime) are
    absent from `players`. (Review Focus #3.)
  - `ops included by default, excluded when configured`: with `excludeOps: true`, Op is absent.
  - `excludeUuids removes a player`.
  - `awards nobody active scored are hidden`: `awards.map(a => a.award.id)` is
    `['breeze-bane']`, and Dave's standings have no `nobody` key.
  - `hall of fame`: Alice and bob have 4 points at rank 1, and Carol has 1 point at rank 3. Op
    is absent. Dave's `hallRank` is `null`.
  - `updatedAt and activeCount`: `updatedAt === T`, and `activeCount === 4` (Alice, bob, Carol
    and Op).
  - `slugs`, using a separate small `RawExport`: `.BedrockPal` → `bedrockpal`. `Bob` and `.bob`
    collide, so both use their UUIDs.

- [ ] **Step 2: Run the tests.** Expected: FAIL.
- [ ] **Step 3: Implement `computeLeaderboard`.**
- [ ] **Step 4: Run `bun test src/lib`.** Expected: PASS. Then `check` and `lint`.
- [ ] **Step 5: Commit.** Message: `feat(stats): compute rankings, medals and hall of fame`.

### Task 5: Award catalogue

**Files:**

- Create: `src/lib/stats/awards.ts`
- Test: `src/lib/stats/awards.test.ts`

**Interfaces:**

- Consumes: the reader constructors from Task 3.
- Produces:
  - `awards: Award[]`
  - `categoryLabels: Record<AwardCategory, string>`, in the order `mining, combat, travel,
farming, crafting, building, misc`, with Title Case labels.

**Content rules:**

- Write names and descriptions fresh, in NearVanilla's voice. Ids are stable kebab-case strings.
- Every stat key must exist in Minecraft 26.x. Verify each against the current Statistics page and
  the item, block and entity ID lists on the Minecraft Wiki.
- The catalogue must cover current content. These keys at minimum (verify each one; drop any that
  don't exist in 26.x and note it):
  - `killed` / `minecraft:breeze`, `minecraft:bogged`, `minecraft:creaking`
  - `used` / `minecraft:mace`, `minecraft:wind_charge`, `minecraft:brush`
  - `custom` / `minecraft:happy_ghast_one_cm`
  - `crafted` / `minecraft:crafter`
  - `mined` / `minecraft:pale_oak_log`
  - any 26.x additions you find in the registry

- [ ] **Step 1: Write the failing tests.**
  - `at least 150 awards`.
  - `ids are unique kebab-case`, matching `/^[a-z0-9]+(-[a-z0-9]+)*$/`.
  - `names are unique and non-empty`, and `descriptions are non-empty`.
  - `every category has at least 10 awards`.
  - `every stat key is namespaced`: every `category`, `key` and `keys[]` entry starts with
    `minecraft:`.
  - `covers current content`: for each verified must-have key, some award's reader references it.
- [ ] **Step 2: Run the tests.** Expected: FAIL.
- [ ] **Step 3: Write the catalogue.** The units are `distance` for `*_one_cm`, `duration` for
      time-in-ticks stats, `health` for `damage_*`, and `count` otherwise.
- [ ] **Step 4: Run `bun test src/lib`.** Expected: PASS. Then `check` and `lint`.
- [ ] **Step 5: Commit.** Message: `feat(stats): award catalogue`.
- [ ] **Step 6: Controller only.** Show the user the catalogue as a table of id, name,
      description and category. **Don't block on their reply:** carry on with Task 6, and apply their
      edits to `awards.ts` as a follow-up commit when they come in.

### Task 6: Server wiring, stats layout, nav link and dev fixture

**Files:**

- Create: `src/lib/server/stats.ts`
- Create: `src/lib/stats/fixtures/export/` containing `players/stats/*.json`,
  `players/advancements/*.json`, `usercache/2026-11-10.json`, `usercache/2026-11-16.json`,
  `ops.json`, `banned-players.json` and `last-seen.json`
- Create: `src/routes/stats/+layout.server.ts`, `src/routes/stats/+layout.svelte`,
  `src/lib/components/stats/StatsNav.svelte`
- Modify: `svelte.config.js`. Add `handleUnseenRoutes: 'warn'` to `kit.prerender`, so that the
  empty-state build doesn't fail on dynamic routes that have no entries.
- Modify: `src/lib/components/Nav.svelte`. Add a top-level `{ label: 'Leaderboards', href: '/stats'
}` after `Map`.

**Interfaces:**

- Consumes: `readExport`, `computeLeaderboard`, `awards` and `defaultConfig`.
- Produces (`src/lib/server/stats.ts`):
  ```ts
  export interface StatsSource {
  	board: Leaderboard;
  	sample: boolean;
  }
  export function getStats(): StatsSource | null; // memoised per process
  export function playerRef(board: Leaderboard, uuid: string): PlayerRef;
  export interface StatsMeta {
  	season: string;
  	updatedAt: number;
  	activeCount: number;
  	sample: boolean;
  }
  ```
  `getStats` behaves like this:
  - If `process.env.STATS_DIR` is set, read it. Any error is rethrown, which fails the build.
  - Otherwise, if `dev` is true (from `$app/environment`), use
    `path.resolve('src/lib/stats/fixtures/export')` with `sample: true`.
  - Otherwise, print `console.warn('[stats] STATS_DIR not set — Leaderboards will show the empty
state')` and return `null`.
- Produces (`+layout.server.ts`): `load` returns `{ meta: StatsMeta | null }`. It must **not**
  pass the whole board to every page.

**Fixture requirements:**

- About 8 players, so that dev shows each case: shared first place, an inactive player, a player
  below the playtime minimum, a banned player, an op, a player whose name exists only in the older
  usercache copy, and a `.BedrockPal` Floodgate-style name.
- `last-seen.json` dates fall within 2026-11-01 to 2026-11-16.
- Stats use keys from at least 12 catalogue awards across at least 4 categories.

**Layout:**

- `<header class="stats-header">` contains:
  - the section eyebrow "Leaderboards";
  - `"{season} · Updated {formatDate(updatedAt)} · {activeCount} active players"`;
  - a "Sample data" notice when `sample` is true;
  - `StatsNav`, which links to Awards (`/stats`), Players (`/stats/players`) and Hall of Fame
    (`/stats/hall-of-fame`), with `aria-current="page"` set from `page.url.pathname`
    (`$app/state`).
- When `meta` is null, render the empty state ("Leaderboards aren't available yet") instead of
  `children`.

- [ ] **Step 1:** Create the fixture, and add a test `fixture computes` in
      `src/lib/stats/fixture.test.ts`. It runs `readExport` and `computeLeaderboard` on the fixture
      (path `join(import.meta.dir, 'fixtures/export')`),
      then asserts `activeCount > 0`, `awards.length >= 12` and `warnings.length === 0`. Run it and
      check that it passes (the engine already exists).
- [ ] **Step 2:** Implement `src/lib/server/stats.ts`, the layout files, `StatsNav`, the Nav link
      and the `svelte.config.js` change. Add a placeholder `src/routes/stats/+page.svelte` (`<h1>Leaderboards</h1>`) so that the
      route exists. Task 7 replaces it.
- [ ] **Step 3:** Run `svelte-autofixer` on each new or changed `.svelte` file until it is clean.
- [ ] **Step 4:** Run `STATS_DIR=src/lib/stats/fixtures/export bun run build`. Expected: the build
      succeeds, and `build/stats.html` contains `active players` and the Leaderboards nav link.
- [ ] **Step 5:** Run `bun run build` with `STATS_DIR` unset. Expected: the build succeeds, the
      warning is printed, and `build/stats.html` contains `aren't available yet`.
- [ ] **Step 6:** Run `bun test src/lib`, `bun run check` and `bun run lint`.
- [ ] **Step 7: Commit.** Message: `feat(stats): server wiring, layout and dev fixture`.

### Task 7: Shared components and overview page

**Files:**

- Create: `src/lib/components/stats/PlayerAvatar.svelte`, `Medal.svelte`, `CategoryGlyph.svelte`,
  and `src/lib/assets/stats/avatar-fallback.svg` (a simple original head silhouette, not a
  Minecraft texture)
- Create: `src/routes/stats/+page.server.ts`, replacing the placeholder `src/routes/stats/+page.svelte`
- Modify: `src/app.css` to add `--color-medal-gold: #f5c542`, `--color-medal-silver: #c0c7d0` and
  `--color-medal-bronze: #cd7f32`

**Interfaces:**

- `PlayerAvatar`:
  - Props are `{ uuid: string; name: string; size?: number }` (default 32).
  - It renders `<img src="https://mc-heads.net/avatar/{uuid}/{size}" alt="" width height
loading="lazy">`.
  - On `onerror` it swaps to the fallback asset.
  - The URL base is one exported constant `AVATAR_BASE` in the component's `<script module>`.
- `Medal`: props `{ medal: Medal }`. It renders a coloured marker plus visually hidden text
  ("Gold medal" and so on).
- `CategoryGlyph`: props `{ category: AwardCategory }`. It renders one small inline SVG per
  category, drawn for this site, with `aria-hidden="true"`.
- Overview `load` returns:
  ```ts
  { categories: { category: AwardCategory; label: string;
      awards: { id: string; name: string; description: string;
        top: (PlayerRef & { rank: number; medal: Medal | null; value: string })[] }[] }[] }
  ```
  Values are pre-formatted with `formatValue`. Categories that have no visible awards are left
  out. When `getStats()` is null, it returns `{ categories: [] }`.

**Page:**

- `<h1>Leaderboards</h1>`, then a `<section>` per category with an `<h2>` that includes
  `CategoryGlyph`.
- Each award is an `<article class="award-card">` containing:
  - the name, linked to `/stats/awards/{id}`;
  - the description;
  - an `<ol>` of the top three entries (`top`, which may hold more than three players when there
    are ties at rank 3; show every entry with rank ≤ 3). Each entry shows `Medal`, `PlayerAvatar`,
    the name linked to `/stats/players/{slug}`, and the value.
- The card grid is responsive.
- `<svelte:head>`: title `NearVanilla SMP - Leaderboards`, a meta description, and canonical
  `https://nearvanilla.com/stats`.

- [ ] **Step 1:** Implement the components, the asset, the tokens and the overview.
- [ ] **Step 2:** Run `svelte-autofixer` until it is clean on all four `.svelte` files.
- [ ] **Step 3:** Run the fixture build (see Task 6, Step 4). Expected: `build/stats.html` has one
      `award-card` per visible award; check this with `grep -o 'class="award-card' build/stats.html |
wc -l`, which should match `awards.length` from the fixture test. It also contains `mc-heads.net`
      and contains no `nobody`-style hidden awards.
- [ ] **Step 4:** Run `bun run dev`, open `/stats` in the browser at 375 px and 1280 px wide, and
      check the layout and that the fallback avatar appears for `.BedrockPal`.
- [ ] **Step 5:** Run `check` and `lint`.
- [ ] **Step 6: Commit.** Message: `feat(stats): leaderboards overview page`.

### Task 8: Award ranking page

**Files:**

- Create: `src/routes/stats/awards/[id]/+page.server.ts`, `+page.svelte`

**Interfaces:**

- `entries()` returns `getStats()?.board.awards.map(a => ({ id: a.award.id })) ?? []`.
- `load` returns `{ award: { id; name; description; category; label }, rows: (PlayerRef & {
rank; medal; value: string })[] }`. An unknown id throws `error(404, 'Award not found')`.

**Page:**

- `<h1>` is the award name, followed by the description and the category with its glyph.
- A `<table>` with a `<caption>` and the columns Rank, Player (avatar plus linked name) and Value.
  Ranks 1–3 show `Medal`.
- A back link to `/stats`.
- `<svelte:head>`: title `NearVanilla SMP - {award name}` and canonical
  `https://nearvanilla.com/stats/awards/{id}`.

- [ ] **Step 1:** Implement the route.
- [ ] **Step 2:** Run `svelte-autofixer` until it is clean.
- [ ] **Step 3:** Run the fixture build. Expected: one `build/stats/awards/*.html` file per visible
      award, and no "not prerendered" errors. In the shared-first-place award's file, two rows carry
      rank 1.
- [ ] **Step 4:** Run `check` and `lint`.
- [ ] **Step 5: Commit.** Message: `feat(stats): award ranking pages`.

### Task 9: Players list and player page

**Files:**

- Create: `src/routes/stats/players/+page.server.ts`, `+page.svelte`
- Create: `src/routes/stats/players/[slug]/+page.server.ts`, `+page.svelte`

**Interfaces:**

- **Players list:** `load` returns `{ rows: (PlayerRef & { playtime: string; lastSeen: string;
active: boolean; gold: number; silver: number; bronze: number })[] }`, in board order.
- **Player page:**
  - `entries()` returns every player's `{ slug }`.
  - `load` returns `{ player: PlayerRef & { active; lastSeen: string; playtime: string; medals:
MedalTally; hallRank: number | null }, categories: { label; category; rows: { awardId; name;
value: string; rank: number | null; medal: Medal | null }[] }[] }`.
  - Rows are grouped in category order; within each category, sort by rank ascending with nulls
    last, then by name.
  - An unknown slug throws `error(404, 'Player not found')`.

**Pages:**

- **Players list:**
  - `<h1>Players</h1>`, then a labelled `<input type="search">` that filters rows by name,
    case-insensitively, through `$state` plus `$derived`. Without JavaScript every row still
    renders.
  - A `<table>` with the columns Player, Playtime, Last seen, the three medal counts, and Status
    (Active/Inactive).
  - A "No players match" row when the filter is empty.
- **Player page:**
  - A header with a large avatar (size 96), `<h1>` name, last seen, playtime, the medal tally and
    the Hall of Fame rank. The Hall of Fame rank links to `/stats/hall-of-fame` when it is not
    null.
  - If the player is inactive, a note: "Inactive for more than 7 days, so not currently ranked.
    Rankings return next time they play." Take the number from `defaultConfig.inactiveDays`.
  - Then a `<section>` per category with a table of Award (linked), Value and Rank/Medal.
- `<svelte:head>` titles: `NearVanilla SMP - Players` and `NearVanilla SMP - {name}`, with
  canonicals.

- [ ] **Step 1:** Implement both routes.
- [ ] **Step 2:** Run `svelte-autofixer` until it is clean.
- [ ] **Step 3:** Run the fixture build. Expected:
  - `build/stats/players.html` lists every fixture player that passes the filters, including the
    inactive one.
  - There is one `build/stats/players/<slug>.html` per player, including `bedrockpal.html`.
  - The inactive player's page contains `not currently ranked`.
- [ ] **Step 4:** In `bun run dev`, check that the search filter works and that clearing it
      restores every row.
- [ ] **Step 5:** Run `check` and `lint`.
- [ ] **Step 6: Commit.** Message: `feat(stats): player list and player pages`.

### Task 10: Hall of Fame page

**Files:**

- Create: `src/routes/stats/hall-of-fame/+page.server.ts`, `+page.svelte`

**Interfaces:**

- `load` returns `{ rows: (PlayerRef & MedalTally & { rank: number })[], points: Record<Medal,
number> }`. `points` comes from `defaultConfig.medalPoints`.

**Page:**

- `<h1>Hall of Fame</h1>`, then a line explaining the scoring, generated from `points`:
  "Gold 4 · Silver 2 · Bronze 1".
- A `<table>` with the columns Rank, Player, Gold, Silver, Bronze and Points.
- `<svelte:head>`: title `NearVanilla SMP - Hall of Fame` and canonical.

- [ ] **Step 1:** Implement the route.
- [ ] **Step 2:** Run `svelte-autofixer` until it is clean.
- [ ] **Step 3:** Run the fixture build. Expected: `build/stats/hall-of-fame.html` exists, and the
      tied players share a rank.
- [ ] **Step 4:** Run `check` and `lint`.
- [ ] **Step 5: Commit.** Message: `feat(stats): hall of fame page`.

### Task 11: Refresh script, Docker wiring, docs, and end-to-end verification

**Files:**

- Create: `scripts/refresh-stats.sh` (executable, `#!/usr/bin/env bash`, `set -euo pipefail`)
- Modify: `Dockerfile`. In the builder stage, after `COPY . .`, add `COPY --from=stats . /stats` and
  `ENV STATS_DIR=/stats`, then `RUN bun run build`.
- Modify: `docker-compose.yml`. Under `web.build`, add `additional_contexts: { stats:
${STATS_EXPORT_DIR:?Set STATS_EXPORT_DIR to the stats export folder} }`. This fails loudly
  rather than silently deploying sample data.
- Modify: `README.md`. Add a "Leaderboards stats" section covering the environment variables, an
  example cron line (`15 4 * * * WORLD_DIR=… SERVER_DIR=… STATS_EXPORT_DIR=…
/path/to/SvelteSite/scripts/refresh-stats.sh >> /var/log/nv-stats.log 2>&1`), the step of
  removing the cron entry at season end, and that Docker Compose v2.17 or later is required.

**Script contract:**

- **Inputs:**
  - `WORLD_DIR`, the world folder that contains `players/`.
  - `SERVER_DIR`, the folder with `usercache.json`, `ops.json` and `banned-players.json`.
  - `STATS_EXPORT_DIR`.
  - Optional `SKIP_DEPLOY=1`.
- **Steps:**
  1. Run `rsync -a` from `$WORLD_DIR/players/stats/` and from `players/advancements/` into the
     export.
  2. Copy `ops.json` and `banned-players.json` with `cp -p`, if they exist.
  3. Copy `usercache.json` to `usercache/$(date -u +%F).json`.
  4. Write `last-seen.json` from the **source** stats mtimes:
     ```bash
     find "$WORLD_DIR/players/stats" -maxdepth 1 -name '*.json' -printf '%f %T@\n' \
       | awk 'BEGIN{printf "{"} {sub(/\.json$/,"",$1); printf "%s\"%s\":%d", (NR>1?",":""), $1, $2*1000} END{print "}"}' \
       > "$STATS_EXPORT_DIR/last-seen.json"
     ```
  5. Unless `SKIP_DEPLOY=1`, `cd` to the repo root (`"$(dirname "$0")/.."`) and run `docker
compose build web && docker compose up -d web`.
- Missing environment variables or a missing `players/stats` folder → print the problem and exit
  non-zero.

- [ ] **Step 1:** Write the script, the Docker and Compose changes, and the README section.
- [ ] **Step 2: Script check.** Build a temporary fake world containing `players/stats/<uuid>.json`
      (with mtime set by `touch -d '2026-11-15 12:00 UTC'`), `players/advancements` and a server folder with
      `usercache.json`. Run it with `SKIP_DEPLOY=1`. Expected: the export folder matches the spec's
      §1 layout, `usercache/<today>.json` exists, and `last-seen.json` holds that UUID →
      `1794744000000`. Run `shellcheck scripts/refresh-stats.sh` if it is available.
- [ ] **Step 3: Docker check** (where Docker is available). Run
      `STATS_EXPORT_DIR=./src/lib/stats/fixtures/export docker compose build web`. Expected: the build
      succeeds, and `docker compose run --rm web ls /usr/share/nginx/html/stats` lists `awards`,
      `players` and `hall-of-fame.html`. Then run `docker compose build web` with the variable unset.
      Expected: it fails, showing the `STATS_EXPORT_DIR` message.
- [ ] **Step 4: End-to-end.**
  - Time the fixture build with `time (STATS_DIR=src/lib/stats/fixtures/export bun run build)`. It
    should take under 30 s; the baseline before this work was about 6 s.
  - Run `STATS_DIR=does/not/exist bun run build`. Expected: it fails with an error that names the
    path.
  - Run the build again with `STATS_DIR` unset. Expected: it succeeds and shows the empty state.
    (Review Focus #5.)
- [ ] **Step 5:** Run `bun test src/lib`, `bun run check` and `bun run lint`, all clean.
- [ ] **Step 6: Commit.** Message: `feat(stats): daily refresh script and docker wiring`.
