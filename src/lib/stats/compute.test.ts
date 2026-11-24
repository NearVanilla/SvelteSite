import { describe, expect, spyOn, test } from 'bun:test';
import { computeLeaderboard } from './compute';
import { defaultConfig } from './config';
import { stat } from './readers';
import type { Award, RawExport, RawPlayer } from './types';

const T = Date.UTC(2026, 10, 17);
const DAY = 86_400_000;

const breezeBane: Award = {
	id: 'breeze-bane',
	name: 'Breeze Bane',
	description: 'Breezes defeated',
	category: 'combat',
	unit: 'count',
	read: stat('minecraft:killed', 'minecraft:breeze')
};

const nobody: Award = {
	id: 'nobody',
	name: 'Nobody',
	description: 'Only inactive players have this',
	category: 'misc',
	unit: 'count',
	read: stat('minecraft:custom', 'minecraft:nobody')
};

function raw(
	uuid: string,
	lastSeen: number,
	playtime: number | null,
	breeze: number,
	extra: Record<string, number> = {}
): RawPlayer {
	const custom: Record<string, number> = { ...extra };
	if (playtime !== null) custom['minecraft:play_time'] = playtime;
	return {
		uuid,
		lastSeen,
		advancements: {},
		stats: { 'minecraft:custom': custom, 'minecraft:killed': { 'minecraft:breeze': breeze } }
	};
}

function fixture(): RawExport {
	return {
		players: [
			raw('alice', T, 72_000, 5),
			raw('bob', T - DAY, 100_000, 5),
			raw('carol', T - 2 * DAY, 100_000, 3),
			raw('dave', T - 8 * DAY, 100_000, 99, { 'minecraft:nobody': 4 }),
			raw('erin', T, 71_999, 50),
			raw('frank', T, 100_000, 80),
			raw('gus', T, null, 10),
			raw('op', T, 100_000, 1)
		],
		names: new Map([
			['alice', 'Alice'],
			['bob', 'bob'],
			['carol', 'Carol'],
			['dave', 'Dave'],
			['erin', 'Erin'],
			['frank', 'Frank'],
			['gus', 'Gus'],
			['op', 'Op']
		]),
		ops: new Set(['op']),
		banned: new Set(['frank']),
		warnings: []
	};
}

const awards = [breezeBane, nobody];

function nameOf(board: ReturnType<typeof computeLeaderboard>, uuid: string): string {
	return board.players.find((p) => p.uuid === uuid)!.name;
}

describe('computeLeaderboard', () => {
	test('breeze ranking uses shared ranks', () => {
		const board = computeLeaderboard(fixture(), awards, defaultConfig);
		const ranking = board.awards[0].ranking.map((e) => [nameOf(board, e.uuid), e.rank, e.medal]);
		expect(ranking).toEqual([
			['Alice', 1, 'gold'],
			['bob', 1, 'gold'],
			['Carol', 3, 'bronze'],
			['Op', 4, null]
		]);
	});

	test('inactive players are listed but unranked', () => {
		const board = computeLeaderboard(fixture(), awards, defaultConfig);
		const dave = board.players.find((p) => p.uuid === 'dave')!;
		expect(dave.active).toBe(false);
		expect(dave.standings['breeze-bane']).toEqual({ value: 99, rank: null, medal: null });
	});

	test('hard filters remove low playtime, banned and no-playtime players', () => {
		const board = computeLeaderboard(fixture(), awards, defaultConfig);
		const uuids = board.players.map((p) => p.uuid);
		expect(uuids).not.toContain('erin');
		expect(uuids).not.toContain('frank');
		expect(uuids).not.toContain('gus');
	});

	test('players are sorted by name, case-insensitively, including inactive', () => {
		const board = computeLeaderboard(fixture(), awards, defaultConfig);
		expect(board.players.map((p) => p.name)).toEqual(['Alice', 'bob', 'Carol', 'Dave', 'Op']);
	});

	test('ops included by default, excluded when configured', () => {
		const included = computeLeaderboard(fixture(), awards, defaultConfig);
		expect(included.players.map((p) => p.uuid)).toContain('op');
		const excluded = computeLeaderboard(fixture(), awards, { ...defaultConfig, excludeOps: true });
		expect(excluded.players.map((p) => p.uuid)).not.toContain('op');
	});

	test('excludeUuids removes a player', () => {
		const board = computeLeaderboard(fixture(), awards, {
			...defaultConfig,
			excludeUuids: ['carol']
		});
		expect(board.players.map((p) => p.uuid)).not.toContain('carol');
	});

	test('players without a name are dropped with a warning', () => {
		const data = fixture();
		data.names.delete('carol');
		const board = computeLeaderboard(data, awards, defaultConfig);
		expect(board.players.map((p) => p.uuid)).not.toContain('carol');
		expect(board.warnings.some((w) => w.includes('carol'))).toBe(true);
	});

	test('dropped-player warnings are printed to the build log', () => {
		const warn = spyOn(console, 'warn').mockImplementation(() => {});
		try {
			const data = fixture();
			data.names.delete('carol');
			computeLeaderboard(data, awards, defaultConfig);
			expect(warn.mock.calls.some(([msg]) => String(msg).includes('carol'))).toBe(true);
		} finally {
			warn.mockRestore();
		}
	});

	test('awards nobody active scored are hidden', () => {
		const board = computeLeaderboard(fixture(), awards, defaultConfig);
		expect(board.awards.map((a) => a.award.id)).toEqual(['breeze-bane']);
		const dave = board.players.find((p) => p.uuid === 'dave')!;
		expect(Object.keys(dave.standings)).toEqual(['breeze-bane']);
	});

	test('hall of fame ranks by medal points with shared ranks', () => {
		const board = computeLeaderboard(fixture(), awards, defaultConfig);
		const hall = board.hallOfFame.map((h) => [h.uuid, h.rank, h.tally.points]);
		expect(hall).toEqual([
			['alice', 1, 4],
			['bob', 1, 4],
			['carol', 3, 1]
		]);
		const alice = board.players.find((p) => p.uuid === 'alice')!;
		expect(alice.medals).toEqual({ gold: 1, silver: 0, bronze: 0, points: 4 });
		expect(alice.hallRank).toBe(1);
		expect(board.players.find((p) => p.uuid === 'dave')!.hallRank).toBeNull();
		expect(board.players.find((p) => p.uuid === 'op')!.hallRank).toBeNull();
	});

	test('updatedAt is the newest lastSeen and activeCount counts active players', () => {
		const board = computeLeaderboard(fixture(), awards, defaultConfig);
		expect(board.updatedAt).toBe(T);
		expect(board.activeCount).toBe(4);
		expect(board.season).toBe('Season 8');
	});

	test('slugs strip symbols and fall back to uuid on collision', () => {
		const data: RawExport = {
			players: [raw('pal', T, 100_000, 1), raw('bob1', T, 100_000, 1), raw('bob2', T, 100_000, 1)],
			names: new Map([
				['pal', '.BedrockPal'],
				['bob1', 'Bob'],
				['bob2', '.bob']
			]),
			ops: new Set(),
			banned: new Set(),
			warnings: []
		};
		const board = computeLeaderboard(data, awards, defaultConfig);
		const slugs = Object.fromEntries(board.players.map((p) => [p.uuid, p.slug]));
		expect(slugs).toEqual({ pal: 'bedrockpal', bob1: 'bob1', bob2: 'bob2' });
	});
});
