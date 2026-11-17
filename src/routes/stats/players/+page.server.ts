import { getStats } from '$lib/server/stats';
import { formatDate, formatValue } from '$lib/stats/format';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const board = getStats()?.board;
	if (!board) return { rows: [] };

	return {
		rows: board.players.map((player) => ({
			uuid: player.uuid,
			name: player.name,
			slug: player.slug,
			playtime: formatValue(player.playtimeTicks, 'duration'),
			lastSeen: formatDate(player.lastSeen),
			active: player.active,
			gold: player.medals.gold,
			silver: player.medals.silver,
			bronze: player.medals.bronze
		}))
	};
};
