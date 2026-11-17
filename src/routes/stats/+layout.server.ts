import { getStatsMeta } from '$lib/server/stats';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	return { meta: getStatsMeta() };
};
