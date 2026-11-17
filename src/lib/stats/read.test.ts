import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readExport } from './read';

const ALICE = '11111111-1111-1111-1111-111111111111';
const BOB = '22222222-2222-2222-2222-222222222222';

function makeExport(): string {
	const dir = mkdtempSync(join(tmpdir(), 'nv-stats-'));
	mkdirSync(join(dir, 'players/stats'), { recursive: true });
	mkdirSync(join(dir, 'players/advancements'), { recursive: true });
	mkdirSync(join(dir, 'usercache'), { recursive: true });
	return dir;
}

function write(dir: string, file: string, data: unknown): string {
	const path = join(dir, file);
	writeFileSync(path, typeof data === 'string' ? data : JSON.stringify(data));
	return path;
}

function writeStats(dir: string, uuid: string, stats: object): string {
	return write(dir, `players/stats/${uuid}.json`, { stats, DataVersion: 4440 });
}

describe('readExport', () => {
	test('reads stats, advancements and names', () => {
		const dir = makeExport();
		writeStats(dir, ALICE, { 'minecraft:killed': { 'minecraft:breeze': 7 } });
		const criteria = { 'minecraft:plains': '2026-11-01 10:00:00 +0000' };
		write(dir, `players/advancements/${ALICE}.json`, {
			'minecraft:adventure/adventuring_time': { criteria, done: false },
			DataVersion: 4440
		});
		write(dir, 'usercache/2026-11-10.json', [{ name: 'Alice', uuid: ALICE, expiresOn: 'x' }]);

		const raw = readExport(dir);

		expect(raw.players).toHaveLength(1);
		expect(raw.players[0].uuid).toBe(ALICE);
		expect(raw.players[0].stats['minecraft:killed']['minecraft:breeze']).toBe(7);
		expect(raw.players[0].advancements['minecraft:adventure/adventuring_time']).toEqual({
			criteria,
			done: false
		});
		expect(raw.names.get(ALICE)).toBe('Alice');
		expect(raw.warnings).toEqual([]);
	});

	test('missing advancements file gives empty advancements', () => {
		const dir = makeExport();
		writeStats(dir, ALICE, {});
		expect(readExport(dir).players[0].advancements).toEqual({});
	});

	test('newest usercache copy wins per uuid', () => {
		const dir = makeExport();
		writeStats(dir, ALICE, {});
		write(dir, 'usercache/2026-11-01.json', [
			{ name: 'OldName', uuid: ALICE, expiresOn: 'x' },
			{ name: 'Bob', uuid: BOB, expiresOn: 'x' }
		]);
		write(dir, 'usercache/2026-11-10.json', [{ name: 'NewName', uuid: ALICE, expiresOn: 'x' }]);

		const raw = readExport(dir);

		expect(raw.names.get(ALICE)).toBe('NewName');
		expect(raw.names.get(BOB)).toBe('Bob');
	});

	test('corrupt usercache copy is skipped with a warning', () => {
		const dir = makeExport();
		writeStats(dir, ALICE, {});
		write(dir, 'usercache/2026-11-01.json', [{ name: 'Alice', uuid: ALICE, expiresOn: 'x' }]);
		write(dir, 'usercache/2026-11-02.json', '[{"name":"Al');

		const raw = readExport(dir);

		expect(raw.names.get(ALICE)).toBe('Alice');
		expect(raw.warnings).toHaveLength(1);
		expect(raw.warnings[0]).toContain('2026-11-02.json');
	});

	test('last-seen.json overrides mtime', () => {
		const dir = makeExport();
		const file = writeStats(dir, ALICE, {});
		const jan = new Date(Date.UTC(2026, 0, 1));
		utimesSync(file, jan, jan);
		write(dir, 'last-seen.json', { [ALICE]: Date.UTC(2026, 10, 16) });

		expect(readExport(dir).players[0].lastSeen).toBe(Date.UTC(2026, 10, 16));
	});

	test('falls back to mtime without last-seen.json', () => {
		const dir = makeExport();
		const file = writeStats(dir, ALICE, {});
		const when = new Date(Date.UTC(2026, 10, 15, 12));
		utimesSync(file, when, when);

		expect(Math.abs(readExport(dir).players[0].lastSeen - when.getTime())).toBeLessThan(1000);
	});

	test('skips malformed file with a warning', () => {
		const dir = makeExport();
		writeStats(dir, ALICE, {});
		write(dir, `players/stats/${BOB}.json`, '{"stats":');

		const raw = readExport(dir);

		expect(raw.players.map((p) => p.uuid)).toEqual([ALICE]);
		expect(raw.warnings).toHaveLength(1);
		expect(raw.warnings[0]).toContain(BOB);
	});

	test('skips file without a stats object with a warning', () => {
		const dir = makeExport();
		writeStats(dir, ALICE, {});
		write(dir, `players/stats/${BOB}.json`, { DataVersion: 4440 });

		const raw = readExport(dir);

		expect(raw.players).toHaveLength(1);
		expect(raw.warnings[0]).toContain(BOB);
	});

	test('throws on missing dir', () => {
		const missing = join(tmpdir(), 'nv-stats-does-not-exist');
		expect(() => readExport(missing)).toThrow(missing);
	});

	test('throws when players/stats is empty', () => {
		const dir = makeExport();
		expect(() => readExport(dir)).toThrow(dir);
	});

	test('ops and bans are optional', () => {
		const dir = makeExport();
		writeStats(dir, ALICE, {});
		const raw = readExport(dir);
		expect(raw.ops.size).toBe(0);
		expect(raw.banned.size).toBe(0);
	});

	test('reads ops and bans when present', () => {
		const dir = makeExport();
		writeStats(dir, ALICE, {});
		write(dir, 'ops.json', [{ uuid: ALICE, name: 'Alice', level: 4 }]);
		write(dir, 'banned-players.json', [{ uuid: BOB, name: 'Bob' }]);

		const raw = readExport(dir);

		expect([...raw.ops]).toEqual([ALICE]);
		expect([...raw.banned]).toEqual([BOB]);
	});
});
