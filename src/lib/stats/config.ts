import type { Medal } from './types';

export interface StatsConfig {
	season: string;
	/** Players not seen within this many days of the export are listed but not ranked. */
	inactiveDays: number;
	/** Players with less playtime than this are left out entirely. */
	minPlaytimeMinutes: number;
	excludeOps: boolean;
	excludeBanned: boolean;
	excludeUuids: string[];
	medalPoints: Record<Medal, number>;
}

export const defaultConfig: StatsConfig = {
	season: 'Season 8',
	inactiveDays: 7,
	minPlaytimeMinutes: 60,
	excludeOps: false,
	excludeBanned: true,
	excludeUuids: [],
	medalPoints: { gold: 4, silver: 2, bronze: 1 }
};
