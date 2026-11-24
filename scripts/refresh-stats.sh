#!/usr/bin/env bash
# Refreshes the Leaderboards stats export from the live Minecraft world, then rebuilds and
# restarts the site container. Run daily from cron; see README.md ("Leaderboards stats").
#
# Required environment:
#   WORLD_DIR         world folder containing players/stats and players/advancements
#   SERVER_DIR        server folder containing usercache.json (and optionally ops.json,
#                     banned-players.json)
#   STATS_EXPORT_DIR  where the export is written; docker-compose.yml builds from it
# Optional:
#   SKIP_DEPLOY=1     refresh the export only; don't rebuild the container
set -euo pipefail

fail() {
	echo "refresh-stats: $*" >&2
	exit 1
}

: "${WORLD_DIR:?WORLD_DIR must point at the world folder}"
: "${SERVER_DIR:?SERVER_DIR must point at the server folder}"
: "${STATS_EXPORT_DIR:?STATS_EXPORT_DIR must point at the stats export folder}"

stats_src="$WORLD_DIR/players/stats"
advancements_src="$WORLD_DIR/players/advancements"
[[ -d "$stats_src" ]] || fail "no player stats folder at $stats_src"
[[ -f "$SERVER_DIR/usercache.json" ]] || fail "no usercache.json in $SERVER_DIR"

mkdir -p "$STATS_EXPORT_DIR/players/stats" "$STATS_EXPORT_DIR/players/advancements" \
	"$STATS_EXPORT_DIR/usercache"

# cp -a keeps modification times, which double as each player's "last seen".
cp -a "$stats_src/." "$STATS_EXPORT_DIR/players/stats/"
if [[ -d "$advancements_src" ]]; then
	cp -a "$advancements_src/." "$STATS_EXPORT_DIR/players/advancements/"
fi
for file in ops.json banned-players.json; do
	if [[ -f "$SERVER_DIR/$file" ]]; then cp -p "$SERVER_DIR/$file" "$STATS_EXPORT_DIR/$file"; fi
done

# One dated usercache copy per day: the site merges them so players who drop out of the
# server's ~1,000-entry cache keep their names.
cp -p "$SERVER_DIR/usercache.json" "$STATS_EXPORT_DIR/usercache/$(date -u +%F).json"

# Record last-seen times from the live files, so they don't depend on timestamps surviving
# the Docker build.
find "$stats_src" -maxdepth 1 -name '*.json' -printf '%f %T@\n' |
	awk 'BEGIN { printf "{" }
		{ sub(/\.json$/, "", $1); printf "%s\"%s\":%.0f", (NR > 1 ? "," : ""), $1, $2 * 1000 }
		END { print "}" }' >"$STATS_EXPORT_DIR/last-seen.json.tmp"
mv "$STATS_EXPORT_DIR/last-seen.json.tmp" "$STATS_EXPORT_DIR/last-seen.json"

echo "refresh-stats: export updated in $STATS_EXPORT_DIR"

if [[ "${SKIP_DEPLOY:-0}" == "1" ]]; then
	exit 0
fi

cd "$(dirname "$0")/.."
docker compose build web
docker compose up -d web
# Each daily build leaves the previous image dangling; clear them so the disk doesn't fill.
docker image prune -f >/dev/null
echo "refresh-stats: site rebuilt and restarted"
