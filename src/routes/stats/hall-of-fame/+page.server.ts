import { getStats, playerRef } from '$lib/server/stats';
import { defaultConfig } from '$lib/stats/config';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const points = defaultConfig.medalPoints;
	const board = getStats()?.board;
	if (!board) return { rows: [], points };

	return {
		rows: board.hallOfFame.map((entry) => ({
			...playerRef(board, entry.uuid),
			...entry.tally,
			rank: entry.rank
		})),
		points
	};
};
