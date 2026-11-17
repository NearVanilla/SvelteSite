import { describe, expect, test } from 'bun:test';
import { criteriaCount, evaluate, stat, sum } from './readers';
import type { Advancements, RawPlayer, StatTable } from './types';

function player(stats: StatTable = {}, advancements: Advancements = {}): RawPlayer {
	return { uuid: 'u', stats, advancements, lastSeen: 0 };
}

describe('evaluate', () => {
	test('stat reads one value', () => {
		const p = player({ 'minecraft:killed': { 'minecraft:breeze': 7 } });
		expect(evaluate(stat('minecraft:killed', 'minecraft:breeze'), p)).toBe(7);
	});

	test('stat missing is 0', () => {
		expect(evaluate(stat('minecraft:killed', 'minecraft:breeze'), player())).toBe(0);
		const p = player({ 'minecraft:killed': {} });
		expect(evaluate(stat('minecraft:killed', 'minecraft:breeze'), p)).toBe(0);
	});

	test('sum adds listed keys only', () => {
		const p = player({
			'minecraft:mined': {
				'minecraft:short_grass': 3,
				'minecraft:tall_grass': 2,
				'minecraft:dirt': 50
			}
		});
		const reader = sum('minecraft:mined', ['minecraft:short_grass', 'minecraft:tall_grass']);
		expect(evaluate(reader, p)).toBe(5);
	});

	test('criteriaCount counts criteria', () => {
		const p = player(
			{},
			{
				'minecraft:adventure/adventuring_time': {
					criteria: { 'minecraft:plains': 'a', 'minecraft:desert': 'b' },
					done: false
				}
			}
		);
		expect(evaluate(criteriaCount('minecraft:adventure/adventuring_time'), p)).toBe(2);
	});

	test('criteriaCount ignores non-object entries and missing advancements', () => {
		const p = player({}, { DataVersion: 4440 });
		expect(evaluate(criteriaCount('DataVersion'), p)).toBe(0);
		expect(evaluate(criteriaCount('minecraft:adventure/adventuring_time'), p)).toBe(0);
	});
});
