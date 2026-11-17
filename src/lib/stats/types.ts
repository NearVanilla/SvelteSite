export type Unit = 'count' | 'distance' | 'duration' | 'health';

export type AwardCategory =
	| 'mining'
	| 'combat'
	| 'travel'
	| 'farming'
	| 'crafting'
	| 'building'
	| 'misc';

export type Medal = 'gold' | 'silver' | 'bronze';

/** Stat category (e.g. `minecraft:killed`) → stat key (e.g. `minecraft:breeze`) → value. */
export type StatTable = Record<string, Record<string, number>>;

/** Raw advancements file. Entries may be non-objects (e.g. the top-level `DataVersion`). */
export type Advancements = Record<string, unknown>;

export type Reader =
	| { kind: 'stat'; category: string; key: string }
	| { kind: 'sum'; category: string; keys: string[] }
	| { kind: 'criteriaCount'; advancement: string };

export interface Award {
	id: string;
	name: string;
	description: string;
	category: AwardCategory;
	unit: Unit;
	read: Reader;
}

export interface RawPlayer {
	uuid: string;
	stats: StatTable;
	advancements: Advancements;
	lastSeen: number;
}

export interface RawExport {
	players: RawPlayer[];
	names: Map<string, string>;
	ops: Set<string>;
	banned: Set<string>;
	warnings: string[];
}

export interface MedalTally {
	gold: number;
	silver: number;
	bronze: number;
	points: number;
}

export interface Standing {
	value: number;
	rank: number | null;
	medal: Medal | null;
}

export interface Player {
	uuid: string;
	name: string;
	slug: string;
	lastSeen: number;
	playtimeTicks: number;
	active: boolean;
	standings: Record<string, Standing>;
	medals: MedalTally;
	hallRank: number | null;
}

export interface RankEntry {
	uuid: string;
	rank: number;
	value: number;
	medal: Medal | null;
}

export interface AwardResult {
	award: Award;
	ranking: RankEntry[];
}

export interface HallEntry {
	uuid: string;
	rank: number;
	tally: MedalTally;
}

export interface PlayerRef {
	uuid: string;
	name: string;
	slug: string;
}

export interface Leaderboard {
	season: string;
	updatedAt: number;
	activeCount: number;
	players: Player[];
	awards: AwardResult[];
	hallOfFame: HallEntry[];
	warnings: string[];
}
