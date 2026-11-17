import { dev } from '$app/environment';
import { resolve } from 'node:path';
import { awards } from '$lib/stats/awards';
import { computeLeaderboard } from '$lib/stats/compute';
import { defaultConfig } from '$lib/stats/config';
import { readExport } from '$lib/stats/read';
import type { Leaderboard, PlayerRef } from '$lib/stats/types';

export interface StatsSource {
	board: Leaderboard;
	sample: boolean;
}

export interface StatsMeta {
	season: string;
	updatedAt: number;
	activeCount: number;
	sample: boolean;
}

const FIXTURE_DIR = 'src/lib/stats/fixtures/export';

let cached: StatsSource | null | undefined;

function load(): StatsSource | null {
	// process.env rather than $env/dynamic: this runs during prerendering at build time.
	const dir = process.env.STATS_DIR;
	if (dir) {
		const board = computeLeaderboard(readExport(dir), awards, defaultConfig);
		return { board, sample: false };
	}
	if (dev) {
		const board = computeLeaderboard(readExport(resolve(FIXTURE_DIR)), awards, defaultConfig);
		return { board, sample: true };
	}
	console.warn('[stats] STATS_DIR not set — Leaderboards will show the empty state');
	return null;
}

/**
 * The leaderboard for this build, computed once per process. Reads `STATS_DIR`; falls back to
 * the sample fixture in dev and to `null` (empty state) in production builds. Throws, failing
 * the build, if `STATS_DIR` is set but unreadable.
 */
export function getStats(): StatsSource | null {
	if (cached === undefined) cached = load();
	return cached;
}

export function getStatsMeta(): StatsMeta | null {
	const stats = getStats();
	if (!stats) return null;
	const { board, sample } = stats;
	return {
		season: board.season,
		updatedAt: board.updatedAt,
		activeCount: board.activeCount,
		sample
	};
}

export function playerRef(board: Leaderboard, uuid: string): PlayerRef {
	const player = board.players.find((p) => p.uuid === uuid);
	if (!player) throw new Error(`Unknown player ${uuid}`);
	return { uuid: player.uuid, name: player.name, slug: player.slug };
}
