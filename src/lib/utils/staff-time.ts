const sinceDateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	year: 'numeric',
	timeZone: 'UTC'
});

const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function parseSinceDate(since: string): Date | null {
	const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(since);
	if (!parts) return null;

	// ISO parsing preserves years 0000–0099, unlike the numeric Date.UTC constructor.
	const date = new Date(`${since}T00:00:00Z`);
	if (
		date.getUTCFullYear() !== Number(parts[1]) ||
		date.getUTCMonth() !== Number(parts[2]) - 1 ||
		date.getUTCDate() !== Number(parts[3])
	) {
		return null;
	}

	return date;
}

/** Formats a valid YYYY-MM-DD start as a UTC short month and year; invalid dates return ''. */
export function formatSinceDate(since: string): string {
	const date = parseSinceDate(since);
	return date ? sinceDateFormatter.format(date) : '';
}

/**
 * Formats completed UTC calendar months, clamping anniversaries to shorter month ends.
 * Invalid dates or future starts return ''; fewer than one completed month returns 'Just joined'.
 */
export function formatTenure(since: string, now: Date): string {
	const start = parseSinceDate(since);
	if (!start || !Number.isFinite(now.getTime()) || start.getTime() > now.getTime()) return '';

	const year = now.getUTCFullYear();
	const month = now.getUTCMonth();
	let months = (year - start.getUTCFullYear()) * 12 + month - start.getUTCMonth();
	const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	const lastDay = month === 1 && leapYear ? 29 : monthLengths[month];
	const anniversaryDay = Math.min(start.getUTCDate(), lastDay);
	if (now.getUTCDate() < anniversaryDay) months -= 1;
	if (months === 0) return 'Just joined';

	const years = Math.floor(months / 12);
	const remainingMonths = months % 12;
	const yearText = years > 0 ? `${years} year${years === 1 ? '' : 's'}` : '';
	const monthText =
		remainingMonths > 0 ? `${remainingMonths} month${remainingMonths === 1 ? '' : 's'}` : '';
	return yearText && monthText ? `${yearText}, ${monthText}` : yearText || monthText;
}
