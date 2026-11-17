import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { Advancements, RawExport, RawPlayer, StatTable } from './types';

interface ProfileEntry {
	uuid?: unknown;
	name?: unknown;
}

function readJson(path: string): unknown {
	return JSON.parse(readFileSync(path, 'utf8'));
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function jsonFiles(dir: string): string[] {
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((file) => file.endsWith('.json'))
		.sort();
}

/** Reads an optional JSON array of `{ uuid }` entries (ops.json, banned-players.json). */
function readUuidSet(path: string): Set<string> {
	if (!existsSync(path)) return new Set();
	const entries = readJson(path);
	if (!Array.isArray(entries)) return new Set();
	return new Set(
		entries
			.map((entry: ProfileEntry) => entry.uuid)
			.filter((uuid): uuid is string => typeof uuid === 'string')
	);
}

function warn(warnings: string[], message: string): void {
	warnings.push(message);
	console.warn(`[stats] ${message}`);
}

/**
 * Merges every usercache copy in file-name (date) order, so newer copies win per UUID. A copy
 * that can't be parsed (e.g. caught mid-write) is skipped: the other copies still supply names.
 */
function readNames(dir: string, warnings: string[]): Map<string, string> {
	const names = new Map<string, string>();
	for (const file of jsonFiles(dir)) {
		let entries: unknown;
		try {
			entries = readJson(join(dir, file));
		} catch (error) {
			const reason = error instanceof Error ? error.message : String(error);
			warn(warnings, `Skipped unreadable usercache copy ${join(dir, file)} (${reason})`);
			continue;
		}
		if (!Array.isArray(entries)) continue;
		for (const entry of entries as ProfileEntry[]) {
			if (typeof entry.uuid === 'string' && typeof entry.name === 'string') {
				names.set(entry.uuid, entry.name);
			}
		}
	}
	return names;
}

function readLastSeen(path: string): Record<string, number> {
	if (!existsSync(path)) return {};
	const data = readJson(path);
	return isObject(data) ? (data as Record<string, number>) : {};
}

/**
 * Reads a stats export folder (26.x layout: `players/stats`, `players/advancements`,
 * `usercache/*.json`, optional `ops.json`, `banned-players.json` and `last-seen.json`).
 * Throws if the folder or its player stats are missing; skips unreadable player files with a
 * warning.
 */
export function readExport(dir: string): RawExport {
	if (!existsSync(dir)) {
		throw new Error(`Stats export folder not found: ${dir}`);
	}
	const statsDir = join(dir, 'players', 'stats');
	const statFiles = jsonFiles(statsDir);
	if (statFiles.length === 0) {
		throw new Error(`No player stats files in ${statsDir} (export folder: ${dir})`);
	}

	const advancementsDir = join(dir, 'players', 'advancements');
	const lastSeen = readLastSeen(join(dir, 'last-seen.json'));
	const warnings: string[] = [];
	const players: RawPlayer[] = [];

	for (const file of statFiles) {
		const uuid = basename(file, '.json');
		const path = join(statsDir, file);
		let stats: StatTable;
		try {
			const data = readJson(path);
			if (!isObject(data) || !isObject(data.stats)) {
				throw new Error('no "stats" object');
			}
			stats = data.stats as StatTable;
		} catch (error) {
			const reason = error instanceof Error ? error.message : String(error);
			const warning = `Skipped player ${uuid}: could not read ${path} (${reason})`;
			warnings.push(warning);
			console.warn(`[stats] ${warning}`);
			continue;
		}

		const advancementsPath = join(advancementsDir, file);
		let advancements: Advancements = {};
		if (existsSync(advancementsPath)) {
			try {
				const data = readJson(advancementsPath);
				if (isObject(data)) advancements = data;
			} catch {
				const warning = `Ignored unreadable advancements for ${uuid}: ${advancementsPath}`;
				warnings.push(warning);
				console.warn(`[stats] ${warning}`);
			}
		}

		players.push({
			uuid,
			stats,
			advancements,
			lastSeen: lastSeen[uuid] ?? statSync(path).mtimeMs
		});
	}

	return {
		players,
		names: readNames(join(dir, 'usercache'), warnings),
		ops: readUuidSet(join(dir, 'ops.json')),
		banned: readUuidSet(join(dir, 'banned-players.json')),
		warnings
	};
}
