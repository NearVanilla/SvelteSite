# Leaderboards — Design

**Date:** 2026-11-17
**Status:** Approved 2026-11-17
**Branch:** `feat/stats-page`

## Intent

NearVanilla used to run [pdinklag/MinecraftStats](https://github.com/pdinklag/MinecraftStats), a
leaderboard site that turns each player's vanilla statistics into "awards" with gold/silver/bronze
medals. That project is abandoned: it has no awards for anything after 1.20.4, silently breaks on
renamed items (`grass` → `short_grass`), and on 26.x finds no players at all because player data
moved to `<world>/players/`. Fixes sit unmerged.

We want the same concept, rebuilt with our own names and content, as a section of the NearVanilla
site ("Leaderboards"), refreshed daily from a stats export on the VPS.

**Scope is the current season only — Season 8** (on 26.x, started after Season 7 ended on
28 Sep 2026, expected to run at least two years). The site never shows data from any other season.
When Season 8 shuts down, the daily refresh is simply switched off and the board stays frozen at its
last export; what happens for Season 9 is out of scope.

## Goals

- A **Leaderboards** section on the site with:
  - `/stats` — overview: every award with its current top three, plus last-updated date and active
    player count.
  - `/stats/awards/[id]` — full ranking for one award.
  - `/stats/players` — every player (active and inactive), searchable.
  - `/stats/players/[name]` — one player: all their award values, ranks and medals, medal totals,
    last seen, playtime.
  - `/stats/hall-of-fame` — players ranked by medal points.
- Our own award catalogue covering current Minecraft content (including 1.20.5 → 26.x additions:
  breeze, bogged, armadillo, mace, trial chambers/vaults, creaking, etc.).
- Reads the 26.x player-data layout (`<world>/players/stats/`, `<world>/players/advancements/`).
- Daily refresh by rebuilding the static site from the latest export, finishing in well under a
  minute.

## Non-goals (v1)

- **Events** (time-boxed competitions). They need a baseline snapshot that survives between builds;
  planned as phase 2, with the snapshot stored alongside the export (see "Phase 2" below).
- Past or future seasons: no archives, no season switcher, no all-time board, no importing old
  world downloads.
- The pre-26 `<world>/stats/` layout and legacy stat keys (e.g. `play_one_minute`).
- Translations, a public API, per-award history, live (sub-daily) updates.
- Per-award item icons (see "Visual design").

## Anti-goals

- **Copying anything from MinecraftStats.** It is CC BY-SA 4.0. No award JSON, localisation
  strings, icons or fonts are reused; award ids, names and descriptions are written fresh. Only
  the concept and the vanilla stat keys (which belong to Minecraft, not the project) carry over.
- **Changing how the rest of the site is deployed.** The site stays `adapter-static` + nginx.
- **Silently publishing wrong data.** A misconfigured build must say so loudly, not deploy an empty
  or sample leaderboard as if it were real (see "Failure behaviour").
- Build-time network calls (e.g. Mojang API). The build must work offline.

## Constraints

- SvelteKit 2 + Svelte 5 runes, TypeScript strict, bun. Tabs, single quotes, no trailing commas,
  100-char lines.
- Semantic HTML (`.claude/rules/semantic_html.md`) and vanilla CSS with BEM-style class names, no
  inline styles (`.claude/rules/vanilla_css.md`). Use existing tokens in `src/app.css`
  (`--color-surface`, `--color-accent`, `--font-display`, etc.).
- The whole site is prerendered (`src/routes/+layout.ts` sets `prerender = true`), served by nginx
  from a Docker image (`Dockerfile`, `docker-compose.yml`).
- No runtime `dependencies`; only devDependencies.

## Approaches considered

| Approach | Trade-offs |
| --- | --- |
| **A. Build-time generation (chosen)** | Daily cron rebuilds the image; SvelteKit reads the export during prerender and emits static HTML for every page. Keeps the deployment unchanged, every page is a real shareable URL, no loading states. Stats only change on rebuild — fine for daily. Measured current build: ~6 s; stats add an estimated few seconds. |
| B. Separate updater + client-side fetch | No rebuilds, but player/award pages can't be prerendered (unknown params), so SPA fallback, loading states, poor link previews; two moving parts — the shape that made the original fragile. |
| C. Switch to a Node/Bun server reading files live | Always fresh, but changes the whole site's deployment for one section with only daily data. |

Chosen by the user: **A**. The stats engine is written as plain TypeScript with no SvelteKit
imports, so it can later move into B or C unchanged.

## Design

### 1. Data contract: the export folder

The Minecraft server and the website run **on the same machine**, so the export is a local copy.
A directory on that machine (path configured, e.g. `/srv/nearvanilla/stats-export`) containing:

```
stats-export/
├── players/stats/<uuid>.json
├── players/advancements/<uuid>.json
├── usercache/<YYYY-MM-DD>.json  # one dated copy of usercache.json per refresh
├── ops.json                     # optional
└── banned-players.json          # optional
```

File **mtimes must be preserved** by the copy — "last seen" is derived from each player's
stats-file mtime, as in the original.

**Names:** vanilla/Paper `usercache.json` only keeps roughly the 1,000 most recent profiles, so over
a two-year season inactive players would fall out of it and vanish from the site. The refresh
script therefore keeps a dated copy every run, and the reader merges all copies, newest file
winning per UUID. (Pure file copy — no extra tools on the host.)

### 2. Refresh pipeline

`scripts/refresh-stats.sh` (committed; run daily by cron on the VPS):

1. Copy the live world's `players/stats` and `players/advancements` and the server's `ops.json`,
   `banned-players.json` into the export folder, preserving mtimes (`rsync -a` or `cp -p`), and
   copy `usercache.json` to `usercache/<today>.json`. Source paths (world folder, server folder,
   export folder, compose project) come from env vars / script arguments — the builder doesn't
   need to know whether the server runs bare, in a container or under a panel.
2. `docker compose build web && docker compose up -d web`. If the build fails, the previous
   container keeps serving and the script exits non-zero so cron reports it.

At end of season the cron entry is removed; nothing else changes.

Getting the export into the image: `docker-compose.yml` adds a named build context
(`additional_contexts: stats: ${STATS_EXPORT_DIR}`), and the `Dockerfile` build stage does
`COPY --from=stats . /stats` with `ENV STATS_DIR=/stats` before `bun run build`. The copy step
comes after `bun install` so the dependency layer stays cached.

**Builder must verify** mtimes survive `COPY` into the build stage. If they don't, the refresh
script instead writes `last-seen.json` (`{ uuid: epochMillis }`) into the export folder and the
reader prefers that file when present.

### 3. Stats engine (`src/lib/stats/`)

Plain TypeScript, no `$app`/`$env`/Svelte imports, so it's unit-testable with `bun test`.

- **`read.ts`** — given a directory, loads all player stats files, advancements, the merged
  usercache copies, ops and bans. Uses Node `fs`. A malformed or unreadable player file is skipped with a build warning
  (a file caught mid-write by the server is the likely cause), not a build failure.
- **`awards.ts`** — the catalogue. Each award:
  ```ts
  { id: string; name: string; description: string; category: AwardCategory; unit: Unit;
    read: Reader }
  ```
  - `Unit`: `count` | `distance` (cm) | `duration` (ticks) | `health` (tenths of a heart).
  - `Reader` (three kinds, as in the original concept):
    - `stat(category, key)` — single value, e.g. `('minecraft:killed', 'minecraft:breeze')`.
    - `sum(category, keys)` — sum of an explicit key list (use explicit lists, not regexes, so
      renames like `short_grass` are handled by listing both old and new keys).
    - `criteriaCount(advancementId)` — number of criteria completed, e.g. biomes visited via
      `minecraft:adventure/adventuring_time`.
  - `AwardCategory`: e.g. mining, combat, travel, farming, crafting, building, misc — used for
    grouping on the overview and for the category glyph.
  - Breadth: comparable to the original (~150–200 awards), names and descriptions written fresh in
    NearVanilla's voice. The exact list is the builder's to draft; the user reviews it.
- **`config.ts`** — tunables with defaults:
  - `inactiveDays: 7`
  - `minPlaytimeMinutes: 60`
  - `excludeOps: false`, `excludeBanned: true`, `excludeUuids: []`
  - `medalPoints: { gold: 4, silver: 2, bronze: 1 }`
  - (All defaults match the original's `config/cli/config.json`.)
- **`compute.ts`** — produces the site's data model:
  - Players: uuid, name (from merged usercache), lastSeen, playtime (`minecraft:custom` →
    `minecraft:play_time`), active flag. Players with no name in any usercache copy are dropped
    with a warning.
  - Hard filter: below `minPlaytimeMinutes`, banned (if enabled), ops (if enabled), excluded UUIDs
    → removed entirely.
  - Active = lastSeen within `inactiveDays` of the **export time** (never the build time or
    "now"), so the frozen end-of-season board keeps its final rankings. Only active players are ranked;
    inactive players still have a player page showing their values, without ranks or medals.
  - Per award: ranking of active players with value > 0, descending. **Ties share a rank**
    (competition ranking: 1, 1, 3), so tied players share the medal. *(Deviation from original,
    which broke ties by name.)*
  - Awards with no ranked players are hidden from the overview (replaces the original's
    DataVersion gating — no version table to maintain).
  - Hall of Fame: medal points = Σ medal weights; ranked descending, ties share rank, players with
    zero points omitted.
  - `updatedAt`: export time (newest stats-file mtime, or `last-seen.json`'s max).
- **`format.ts`** — value formatting by unit: counts with thousands separators; distance in
  blocks/km (100 cm = 1 block); duration as days/hours/minutes (20 ticks = 1 s); health as hearts.

### 4. SvelteKit wiring

- A server-only module (`src/lib/server/stats.ts`) calls the engine once per build and memoises the
  result (module-level cache), so ~hundreds of prerendered pages don't re-read the folder.
- It reads the directory from `process.env.STATS_DIR` (not `$env/dynamic/*`, which has prerender
  restrictions/deprecation; `process.env` in server code is unambiguous at build time).
- Routes use `+page.server.ts` `load` functions. Dynamic routes export `entries()` listing every
  award id / player slug so all pages prerender even if not linked.
- **Player slug:** lowercase current name (`/stats/players/105hua`). If two players' names collide
  after lowercasing, both fall back to their UUID slug.
- **Award id:** kebab-case, stable, chosen when the award is written (e.g. `breeze-bane`).
- Nav: add a top-level `{ label: 'Leaderboards', href: '/stats' }` in
  `src/lib/components/Nav.svelte`.
- Page `<title>`s follow the existing pattern used by other routes.

### 5. Pages

- **Overview (`/stats`)** — header with "Season 8 · Updated <date> · <n> active players" (season
  label is a constant in `config.ts`) and sub-navigation
  (Awards / Players / Hall of Fame). Awards grouped by category; each is an `<article>` card:
  name, short description, top three with medal, avatar, name (linked) and formatted value. Card
  links to the full ranking.
- **Award (`/stats/awards/[id]`)** — name, description, category; table (`<table>`) of rank,
  player, value for all ranked players. Medal markers on ranks 1–3.
- **Players (`/stats/players`)** — single table of all players: avatar, name, playtime, last seen,
  medal counts, active/inactive. A search `<input>` filters rows client-side (progressive
  enhancement: page is complete without JS). Sortable columns are optional.
- **Player (`/stats/players/[name]`)** — avatar, name, last seen, playtime, medal totals,
  Hall-of-Fame rank; then every award with a value > 0 grouped by category: value, rank (if
  active), medal. Inactive players get a note explaining why they have no ranks.
- **Hall of Fame (`/stats/hall-of-fame`)** — table: rank, player, gold/silver/bronze counts, points.

Sketch of the overview:

```
┌ Leaderboards ──────────────── [Awards] [Players] [Hall of Fame] ┐
│ Updated 17 Nov 2026 · 142 active players                        │
│ Mining                                                          │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│ │ Deep Diver    │ │ Ore Hound    │ │ …            │              │
│ │ 🥇 Alex 4,210 │ │ 🥇 Steve 311 │ │              │              │
│ │ 🥈 … 🥉 …     │ │ 🥈 … 🥉 …    │ │              │              │
│ └──────────────┘ └──────────────┘ └──────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 6. Visual design

- Matches the existing site: dark surfaces, `--font-display` headings, accent blue, lime/sky brand
  colours for highlights.
- **Avatars:** loaded in the browser from a public UUID-keyed head service (default
  `https://mc-heads.net/avatar/<uuid>/<size>`), with `loading="lazy"`, explicit width/height, and
  a local fallback image on error (also covers Bedrock/Floodgate UUIDs the service can't resolve).
  The service URL is a single constant so it can be swapped.
- **Award icons:** no per-item textures in v1 (Minecraft textures are Mojang's; original icons are
  BY-SA). Each category gets a small inline SVG glyph drawn for this site.
- Medals: gold/silver/bronze rendered with CSS (colour tokens added to `app.css`), with text
  equivalents for screen readers.

### 7. Failure behaviour

| Situation | Behaviour |
| --- | --- |
| `STATS_DIR` unset, `bun run dev` | Use a small committed fixture export (`src/lib/stats/fixtures/`) so the pages can be developed; pages show a "Sample data" notice. |
| `STATS_DIR` unset, production build | Build succeeds; `/stats` renders an "Leaderboards aren't available yet" empty state; build prints a clear warning. No fixture data in production. |
| `STATS_DIR` set but missing/unreadable, or contains no player files | **Build fails** with a clear error — the cron job keeps the previous container running. |
| Individual player file malformed | Skipped with a warning. |
| Player missing from usercache | Dropped with a warning. |

### 8. Testing

- `bun test` unit tests for the engine against fixtures: reader kinds, usercache merging (newest
  wins, names kept after falling out of the latest copy), `short_grass`-style renames, filters, active/inactive cut-off, shared-rank ties, medal points,
  formatting.
- `bun run check` and `bun run lint` clean; `svelte-autofixer` clean on every `.svelte` file.
- Build against the fixture export and confirm every award and player page is emitted
  (no "marked as prerenderable but not prerendered" errors) and build time stays small.

## Phase 2 (not in v1): events

Time-boxed competitions on one award. Event definitions live in the repo; the refresh script keeps a
baseline snapshot per event in the export folder (`events/<id>/baseline.json`), written on the first
refresh at or after the start time. Score = current − baseline; after the end, the final ranking is
frozen to `events/<id>/final.json`. Designed separately when we get there.

## Left to the builder

- The award catalogue itself (ids, names, descriptions, categories, stat keys), for user review.
- Exact layout/CSS within the existing visual language; whether player tables are sortable.
- Fixture contents.
- Mechanism detail for the Docker build context, subject to the mtime check in §2.

## Decided by the user

- Approach A (build-time generation, daily rebuild).
- Season 8 only; board freezes when the season ends; no other seasons ever shown.
- Minecraft server and website are on the same machine.
- Events deferred to phase 2.
- Active window of 7 days, as in the original.
- Reviewed and accepted the calls below.

## Calls made without explicit user input (reviewed and accepted by the user)

- Section name "Leaderboards" at `/stats`; "Hall of Fame" at `/stats/hall-of-fame`.
- Ties share rank and medal.
- Awards with no ranked players are hidden.
- Avatars from mc-heads.net in the browser; category glyphs instead of item icons.
- Player URLs by lowercase name; UUID fallback on collision.
- Player list on one searchable page instead of pagination.
- Dated usercache copies merged at build time, so inactive players keep their names.
- Only the 26.x player-data layout is supported.
