import type { RawPlayer, Reader } from './types';

/** A single stat value, e.g. `stat('minecraft:killed', 'minecraft:breeze')`. */
export function stat(category: string, key: string): Reader {
	return { kind: 'stat', category, key };
}

/** The sum of an explicit list of keys within one stat category. */
export function sum(category: string, keys: string[]): Reader {
	return { kind: 'sum', category, keys };
}

/** How many criteria of an advancement the player has completed. */
export function criteriaCount(advancement: string): Reader {
	return { kind: 'criteriaCount', advancement };
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function evaluate(reader: Reader, player: RawPlayer): number {
	switch (reader.kind) {
		case 'stat':
			return player.stats[reader.category]?.[reader.key] ?? 0;
		case 'sum': {
			const table = player.stats[reader.category] ?? {};
			return reader.keys.reduce((total, key) => total + (table[key] ?? 0), 0);
		}
		case 'criteriaCount': {
			const entry = player.advancements[reader.advancement];
			if (!isObject(entry) || !isObject(entry.criteria)) return 0;
			return Object.keys(entry.criteria).length;
		}
	}
}
