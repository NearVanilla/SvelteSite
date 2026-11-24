import { expect, test } from 'bun:test';
import { join } from 'node:path';
import { awards } from './awards';
import { computeLeaderboard } from './compute';
import { defaultConfig } from './config';
import { readExport } from './read';

test('fixture computes', () => {
	const board = computeLeaderboard(
		readExport(join(import.meta.dir, 'fixtures/export')),
		awards,
		defaultConfig
	);
	expect(board.activeCount).toBeGreaterThan(0);
	expect(board.awards.length).toBeGreaterThanOrEqual(12);
	expect(new Set(board.awards.map((a) => a.award.category)).size).toBeGreaterThanOrEqual(4);
	expect(board.warnings).toEqual([]);
	expect(board.players.map((p) => p.name)).toContain('OldTimer');
	expect(board.players.find((p) => p.name === 'Dave')?.active).toBe(false);
});
