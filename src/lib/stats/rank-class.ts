/** CSS class (from stats.css) that colours a rank: gold, silver, bronze, or grey. */
export function rankClass(rank: number | null): string {
	if (rank !== null && rank >= 1 && rank <= 3) return `stats-rank-${rank}`;
	return 'stats-rank-other';
}
