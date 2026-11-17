import type { StatsConfig } from './config';
import { evaluate } from './readers';
import type {
	Award,
	AwardResult,
	HallEntry,
	Leaderboard,
	Medal,
	MedalTally,
	Player,
	RawExport,
	RawPlayer,
	Standing
} from './types';

const DAY_MS = 86_400_000;
const TICKS_PER_MINUTE = 1200;
const MEDALS: Record<number, Medal> = { 1: 'gold', 2: 'silver', 3: 'bronze' };

const byName = (a: string, b: string) =>
	a.localeCompare(b, 'en', { sensitivity: 'base' }) || a.localeCompare(b);

/**
 * Competition ranking ("1, 1, 3"): sorted by score descending, then name; equal scores share
 * the rank of the first of them.
 */
function rankBy<T>(
	items: T[],
	score: (item: T) => number,
	name: (item: T) => string
): (T & { rank: number })[] {
	const sorted = [...items].sort((a, b) => score(b) - score(a) || byName(name(a), name(b)));
	let rank = 0;
	return sorted.map((item, index) => {
		if (index === 0 || score(item) !== score(sorted[index - 1])) rank = index + 1;
		return { ...item, rank };
	});
}

/** Lowercase name with anything outside [a-z0-9_] removed; UUID when empty or ambiguous. */
function assignSlugs(players: { uuid: string; name: string }[]): Map<string, string> {
	const base = new Map(
		players.map((p) => [p.uuid, p.name.toLowerCase().replace(/[^a-z0-9_]/g, '')])
	);
	const counts = new Map<string, number>();
	for (const slug of base.values()) counts.set(slug, (counts.get(slug) ?? 0) + 1);
	return new Map(
		[...base].map(([uuid, slug]) => [uuid, slug && counts.get(slug) === 1 ? slug : uuid])
	);
}

function playtimeOf(player: RawPlayer): number {
	return player.stats['minecraft:custom']?.['minecraft:play_time'] ?? 0;
}

export function computeLeaderboard(
	raw: RawExport,
	awards: Award[],
	config: StatsConfig
): Leaderboard {
	const warnings = [...raw.warnings];
	const updatedAt = Math.max(0, ...raw.players.map((p) => p.lastSeen));
	const minTicks = config.minPlaytimeMinutes * TICKS_PER_MINUTE;
	const excluded = new Set(config.excludeUuids);

	const eligible = raw.players.flatMap((player) => {
		const name = raw.names.get(player.uuid);
		if (name === undefined) {
			warnings.push(`Dropped player ${player.uuid}: no name in any usercache copy`);
			return [];
		}
		if (playtimeOf(player) < minTicks) return [];
		if (config.excludeBanned && raw.banned.has(player.uuid)) return [];
		if (config.excludeOps && raw.ops.has(player.uuid)) return [];
		if (excluded.has(player.uuid)) return [];
		return [{ raw: player, name }];
	});

	const slugs = assignSlugs(eligible.map((p) => ({ uuid: p.raw.uuid, name: p.name })));
	const players: Player[] = eligible
		.map(({ raw: player, name }) => ({
			uuid: player.uuid,
			name,
			slug: slugs.get(player.uuid)!,
			lastSeen: player.lastSeen,
			playtimeTicks: playtimeOf(player),
			active: updatedAt - player.lastSeen <= config.inactiveDays * DAY_MS,
			standings: {} as Record<string, Standing>,
			medals: { gold: 0, silver: 0, bronze: 0, points: 0 } as MedalTally,
			hallRank: null as number | null
		}))
		.sort((a, b) => byName(a.name, b.name));
	const rawByUuid = new Map(eligible.map((p) => [p.raw.uuid, p.raw]));

	const visibleAwards: AwardResult[] = [];
	for (const award of awards) {
		const values = players.map((player) => ({
			player,
			value: evaluate(award.read, rawByUuid.get(player.uuid)!)
		}));
		const ranked = rankBy(
			values.filter((v) => v.player.active && v.value > 0),
			(v) => v.value,
			(v) => v.player.name
		);
		if (ranked.length === 0) continue;

		visibleAwards.push({
			award,
			ranking: ranked.map(({ player, value, rank }) => ({
				uuid: player.uuid,
				rank,
				value,
				medal: MEDALS[rank] ?? null
			}))
		});
		const rankOf = new Map(ranked.map((r) => [r.player.uuid, r.rank]));
		for (const { player, value } of values) {
			if (value <= 0) continue;
			const rank = rankOf.get(player.uuid) ?? null;
			const medal = rank === null ? null : (MEDALS[rank] ?? null);
			player.standings[award.id] = { value, rank, medal };
			if (medal) {
				player.medals[medal] += 1;
				player.medals.points += config.medalPoints[medal];
			}
		}
	}

	const hallOfFame: HallEntry[] = rankBy(
		players.filter((p) => p.medals.points > 0),
		(p) => p.medals.points,
		(p) => p.name
	).map((p) => ({ uuid: p.uuid, rank: p.rank, tally: p.medals }));
	const hallRanks = new Map(hallOfFame.map((h) => [h.uuid, h.rank]));
	for (const player of players) player.hallRank = hallRanks.get(player.uuid) ?? null;

	return {
		season: config.season,
		updatedAt,
		activeCount: players.filter((p) => p.active).length,
		players,
		awards: visibleAwards,
		hallOfFame,
		warnings
	};
}
