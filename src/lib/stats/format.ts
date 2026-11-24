import type { Unit } from './types';

const TICKS_PER_MINUTE = 20 * 60;
const MINUTES_PER_DAY = 24 * 60;

const numberFormat = new Intl.NumberFormat('en-GB');
const dateFormat = new Intl.DateTimeFormat('en-GB', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
	timeZone: 'UTC'
});

function plural(n: number, word: string): string {
	return `${numberFormat.format(n)} ${word}${n === 1 ? '' : 's'}`;
}

/** Centimetres → blocks (1 block = 1 m), switching to km from 1,000 blocks. */
function formatDistance(cm: number): string {
	const blocks = Math.round(cm / 100);
	if (blocks < 1000) return plural(blocks, 'block');
	return `${numberFormat.format(Number((blocks / 1000).toFixed(1)))} km`;
}

/** Ticks → "12m", "1h 30m" or "2d 5h". */
function formatDuration(ticks: number): string {
	const totalMinutes = Math.floor(ticks / TICKS_PER_MINUTE);
	const days = Math.floor(totalMinutes / MINUTES_PER_DAY);
	const hours = Math.floor((totalMinutes % MINUTES_PER_DAY) / 60);
	const minutes = totalMinutes % 60;
	if (days > 0) return `${numberFormat.format(days)}d ${hours}h`;
	if (hours > 0) return `${hours}h ${minutes}m`;
	return `${minutes}m`;
}

/** Tenths of a health point → hearts (one heart = 2 HP = 20 tenths). */
function formatHealth(tenths: number): string {
	return plural(Math.round(tenths / 20), 'heart');
}

export function formatValue(value: number, unit: Unit): string {
	switch (unit) {
		case 'count':
			return numberFormat.format(value);
		case 'distance':
			return formatDistance(value);
		case 'duration':
			return formatDuration(value);
		case 'health':
			return formatHealth(value);
	}
}

export function formatDate(ms: number): string {
	return dateFormat.format(ms);
}

/**
 * Short label for an award's value, from its description: the first sentence without its full
 * stop ("Deaths. It happens to everyone." becomes "Deaths").
 */
export function statLabel(description: string): string {
	return description.split('.')[0].trim();
}
