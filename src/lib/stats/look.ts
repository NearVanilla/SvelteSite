/**
 * Visual "looks" for the Leaderboards spike. Pick one with `?look=<id>` on any stats page; the
 * choice is kept in sessionStorage while you click around. `classic` (the default) follows the
 * old MinecraftStats layout; the other three are earlier explorations kept for comparison.
 */
export const LOOKS = [
	{ id: 'classic', name: 'Classic (MinecraftStats)' },
	{ id: 'slate', name: 'Slate & copper' },
	{ id: 'brand', name: 'NearVanilla colours' },
	{ id: 'quiet', name: 'Quiet pixel' }
] as const;

export type LookId = (typeof LOOKS)[number]['id'];

export const DEFAULT_LOOK: LookId = 'classic';

export const LOOK_STORAGE_KEY = 'nv-stats-look';

export function isLook(value: unknown): value is LookId {
	return LOOKS.some((look) => look.id === value);
}
