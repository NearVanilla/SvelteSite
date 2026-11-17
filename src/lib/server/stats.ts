import { dev } from '$app/environment';
import { resolve } from 'node:path';
import { awards } from '$lib/stats/awards';
import { computeLeaderboard } from '$lib/stats/compute';
import { defaultConfig } from '$lib/stats/config';
import { formatValue } from '$lib/stats/format';
import { readExport } from '$lib/stats/read';
import type { AwardResult, Leaderboard, Medal, Player, PlayerRef } from '$lib/stats/types';

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

const playerIndex = new WeakMap<Leaderboard, Map<string, Player>>();

export function playerRef(board: Leaderboard, uuid: string): PlayerRef {
	let index = playerIndex.get(board);
	if (!index) {
		index = new Map(board.players.map((p) => [p.uuid, p]));
		playerIndex.set(board, index);
	}
	const player = index.get(uuid);
	if (!player) throw new Error(`Unknown player ${uuid}`);
	return { uuid: player.uuid, name: player.name, slug: player.slug };
}

export interface RankingRow extends PlayerRef {
	rank: number;
	medal: Medal | null;
	value: string;
}

/** An award's ranking as display rows, optionally only entries ranked `maxRank` or better. */
export function rankingRows(
	board: Leaderboard,
	result: AwardResult,
	maxRank = Number.POSITIVE_INFINITY
): RankingRow[] {
	return result.ranking
		.filter((entry) => entry.rank <= maxRank)
		.map((entry) => ({
			...playerRef(board, entry.uuid),
			rank: entry.rank,
			medal: entry.medal,
			value: formatValue(entry.value, result.award.unit)
		}));
}
