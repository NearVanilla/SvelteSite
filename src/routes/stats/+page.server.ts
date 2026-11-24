import { getStats, rankingRows } from '$lib/server/stats';
import { categoryLabels } from '$lib/stats/awards';
import { defaultConfig } from '$lib/stats/config';
import type { AwardCategory } from '$lib/stats/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const { inactiveDays } = defaultConfig;
	const stats = getStats();
	if (!stats) return { categories: [], inactiveDays };
	const { board } = stats;

	const categories = (Object.keys(categoryLabels) as AwardCategory[])
		.map((category) => ({
			category,
			label: categoryLabels[category],
			awards: board.awards
				.filter((result) => result.award.category === category)
				.map((result) => ({
					id: result.award.id,
					name: result.award.name,
					description: result.award.description,
					top: rankingRows(board, result, 3)
				}))
		}))
		.filter((group) => group.awards.length > 0);

	return { categories, inactiveDays };
};
