import { error } from '@sveltejs/kit';
import { getStats } from '$lib/server/stats';
import { categoryLabels } from '$lib/stats/awards';
import { defaultConfig } from '$lib/stats/config';
import { formatDate, formatValue } from '$lib/stats/format';
import type { AwardCategory } from '$lib/stats/types';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	getStats()?.board.players.map((player) => ({ slug: player.slug })) ?? [];

const byRankThenName = (
	a: { rank: number | null; name: string },
	b: { rank: number | null; name: string }
) =>
	(a.rank ?? Number.POSITIVE_INFINITY) - (b.rank ?? Number.POSITIVE_INFINITY) ||
	a.name.localeCompare(b.name);

export const load: PageServerLoad = ({ params }) => {
	const board = getStats()?.board;
	const player = board?.players.find((p) => p.slug === params.slug);
	if (!board || !player) error(404, 'Player not found');

	const rows = board.awards.flatMap((result) => {
		const standing = player.standings[result.award.id];
		if (!standing) return [];
		return [
			{
				awardId: result.award.id,
				name: result.award.name,
				category: result.award.category,
				value: formatValue(standing.value, result.award.unit),
				rank: standing.rank,
				medal: standing.medal
			}
		];
	});

	const categories = (Object.keys(categoryLabels) as AwardCategory[])
		.map((category) => ({
			category,
			label: categoryLabels[category],
			rows: rows.filter((row) => row.category === category).sort(byRankThenName)
		}))
		.filter((group) => group.rows.length > 0);

	return {
		player: {
			uuid: player.uuid,
			name: player.name,
			slug: player.slug,
			active: player.active,
			lastSeen: formatDate(player.lastSeen),
			playtime: formatValue(player.playtimeTicks, 'duration'),
			medals: player.medals,
			hallRank: player.hallRank
		},
		categories,
		inactiveDays: defaultConfig.inactiveDays
	};
};
