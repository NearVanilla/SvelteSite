import { describe, expect, test } from 'bun:test';
import { awards, categoryLabels } from './awards';
import type { AwardCategory, Reader } from './types';

function keysOf(reader: Reader): string[] {
	switch (reader.kind) {
		case 'stat':
			return [`${reader.category}/${reader.key}`];
		case 'sum':
			return reader.keys.map((key) => `${reader.category}/${key}`);
		case 'criteriaCount':
			return [`advancement/${reader.advancement}`];
	}
}

/** Content added from 1.20.5 to 26.x, verified against the Minecraft Wiki (Nov 2026). */
const mustHave = [
	'minecraft:killed/minecraft:breeze',
	'minecraft:killed/minecraft:bogged',
	'minecraft:killed/minecraft:creaking',
	'minecraft:killed/minecraft:parched',
	'minecraft:killed/minecraft:camel_husk',
	'minecraft:killed/minecraft:zombie_nautilus',
	'minecraft:used/minecraft:mace',
	'minecraft:used/minecraft:wind_charge',
	'minecraft:used/minecraft:brush',
	'minecraft:used/minecraft:trial_key',
	'minecraft:used/minecraft:ominous_bottle',
	'minecraft:custom/minecraft:happy_ghast_one_cm',
	'minecraft:custom/minecraft:nautilus_one_cm',
	'minecraft:crafted/minecraft:crafter',
	'minecraft:mined/minecraft:pale_oak_log'
];

describe('award catalogue', () => {
	test('has at least 150 awards', () => {
		expect(awards.length).toBeGreaterThanOrEqual(150);
	});

	test('ids are unique kebab-case', () => {
		const ids = awards.map((a) => a.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
	});

	test('names are unique and non-empty, descriptions non-empty', () => {
		const names = awards.map((a) => a.name);
		expect(new Set(names).size).toBe(names.length);
		for (const award of awards) {
			expect(award.name.trim()).not.toBe('');
			expect(award.description.trim()).not.toBe('');
		}
	});

	test('every category has at least 10 awards', () => {
		for (const category of Object.keys(categoryLabels) as AwardCategory[]) {
			const count = awards.filter((a) => a.category === category).length;
			expect({ category, enough: count >= 10 }).toEqual({ category, enough: true });
		}
	});

	test('every stat key is namespaced', () => {
		for (const award of awards) {
			const { read } = award;
			if (read.kind === 'criteriaCount') {
				expect(read.advancement).toStartWith('minecraft:');
				continue;
			}
			expect(read.category).toStartWith('minecraft:');
			for (const key of read.kind === 'stat' ? [read.key] : read.keys) {
				expect(key).toStartWith('minecraft:');
			}
		}
	});

	test('covers current content', () => {
		const referenced = new Set(awards.flatMap((a) => keysOf(a.read)));
		const missing = mustHave.filter((key) => !referenced.has(key));
		expect(missing).toEqual([]);
	});
});
