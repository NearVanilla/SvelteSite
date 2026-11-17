# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv@0.12.5 create --template minimal --types ts --add prettier eslint mcp="ide:cursor,claude-code+setup:remote" --install bun sveltesite
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Community gallery

The two screenshot rows in `src/lib/components/Gallery.svelte` use a 150-second
scroll loop. Each row pauses on hover, and reduced-motion preferences disable scrolling.

### Site navigation

Home, About, Plugins, and Specs link to sections on the homepage using `/#...` URLs.
Keep the leading `/` so these links also work from the Downloads and Staff pages.

### Staff profiles

Staff cards open compact, responsive profiles with a small Minecraft skin beside the player's
name, join date, time served, and location. Profiles stay side-by-side on mobile and are capped
at 480px wide on desktop. Taglines, timezones, local clocks, and quotes are not displayed.

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Leaderboards stats

The Leaderboards section (`/stats`) is generated at build time from a stats export folder. The
build reads it from `STATS_DIR`; Docker gets it through the `stats` build context set by
`STATS_EXPORT_DIR`.

- `bun run dev` with no `STATS_DIR` uses the sample export in `src/lib/stats/fixtures/export` and
  shows a "Sample data" notice.
- `bun run build` with no `STATS_DIR` builds the empty "coming soon" state.
- A `STATS_DIR` that is missing or has no player stats fails the build.
- `docker compose build` requires `STATS_EXPORT_DIR` (Docker Compose v2.17+ for
  `additional_contexts`). To try it locally:
  `STATS_EXPORT_DIR=./src/lib/stats/fixtures/export docker compose build web`.

### Daily refresh on the VPS

`scripts/refresh-stats.sh` copies the world's player stats into the export folder, records each
player's last-seen time, keeps a dated copy of `usercache.json`, then rebuilds and restarts the
container. Example cron entry (04:15 daily):

```cron
15 4 * * * WORLD_DIR=/srv/minecraft/world SERVER_DIR=/srv/minecraft STATS_EXPORT_DIR=/srv/nearvanilla/stats-export /srv/nearvanilla/SvelteSite/scripts/refresh-stats.sh >> /var/log/nv-stats.log 2>&1
```

Put `STATS_EXPORT_DIR` in the compose project's `.env` too, so manual `docker compose` commands
work. If a build fails, the previous container keeps serving and the script exits non-zero.

At the end of the season, remove the cron entry: the board stays frozen at its last export.

Award definitions live in `src/lib/stats/awards.ts`; ranking rules and defaults (7-day active
window, 60-minute minimum playtime, medal points 4/2/1) in `src/lib/stats/config.ts`.
