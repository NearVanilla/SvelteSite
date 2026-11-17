import { error } from '@sveltejs/kit';
import { getStats, rankingRows } from '$lib/server/stats';
import { categoryLabels } from '$lib/stats/awards';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	getStats()?.board.awards.map((result) => ({ id: result.award.id })) ?? [];

export const load: PageServerLoad = ({ params }) => {
	const board = getStats()?.board;
	const result = board?.awards.find((r) => r.award.id === params.id);
	if (!board || !result) error(404, 'Award not found');

	const { id, name, description, category } = result.award;
	return {
		award: { id, name, description, category, label: categoryLabels[category] },
		rows: rankingRows(board, result)
	};
};
