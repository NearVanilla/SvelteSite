export interface Builder {
	name: string;
	flag?: string;
}

export interface ScreenshotMeta {
	filename: string; // WebP filename without extension
	alt: string;
	buildName?: string;
	builders?: Builder[];
}

export const screenshotMeta: ScreenshotMeta[] = [
	{
		filename: '2026-03-14_01.34.02_4K',
		alt: 'White building beside a wooden plaza and tall trees'
	},
	{
		filename: '2026-03-14_01.34.11_4K',
		alt: 'Modern white-and-black building beside a landscaped path'
	},
	{
		filename: '2026-03-14_01.34.30_4K',
		alt: 'Timber-framed white house beside trees and a stone path'
	},
	{
		filename: '2026-03-14_01.35.07_4K',
		alt: 'Tall timber-framed waterfront building beside a canal'
	},
	{ filename: '2026-03-14_01.35.47_4K', alt: 'Orange building beside paths and rows of crops' },
	{
		filename: '2026-03-14_01.36.03_4K',
		alt: 'Purple-and-teal striped structure over water beside a wooden dock'
	},
	{
		filename: '2026-03-14_01.36.18_4K',
		alt: 'Lantern-lit interior with flowers, shelving and a pink floor'
	},
	{
		filename: '2026-03-14_01.36.37_4K',
		alt: 'Stone steps leading toward a red-and-white sculpture among trees'
	},
	{
		filename: '2026-03-14_01.37.04_4K',
		alt: 'Large blue-and-white spherical sculpture above a landscaped plaza'
	},
	{
		filename: '2026-03-14_01.37.10_4K',
		alt: 'White-framed green glass building beside a path and broad trees'
	},
	{
		filename: '2026-03-14_01.37.24_4K',
		alt: 'Tall wooden interior beneath a red ceiling dotted with lights'
	},
	{
		filename: '2026-03-14_01.37.52_4K',
		alt: 'Green-beamed hall with hanging lanterns and a central walkway'
	},
	{
		filename: '2026-03-14_01.38.09_4K',
		alt: 'Dim wood-and-stone interior with hanging greenery and warm lights'
	},
	{
		filename: '2026-03-14_01.39.23_4K',
		alt: 'Giant red gumball-machine-shaped building topped with a glass globe'
	},
	{ filename: '2026-03-14_01.39.50_4K', alt: 'Green-and-dark tower at the end of a path' },
	{
		filename: '2026-03-14_01.40.20_4K',
		alt: 'Striped low building beside a grassy area and small crop beds'
	},
	{ filename: '2026-03-14_01.40.31_4K', alt: 'Stone castle walls and towers following a hillside' },
	{
		filename: '2026-03-14_01.41.20_4K',
		alt: 'Deep stone-built passage with balconies and warm lights'
	},
	{
		filename: '2026-03-14_01.42.02_4K',
		alt: 'Large block-built character statue beside a path at sunset'
	}
];

/** Look up metadata by filename (without extension). Returns undefined if not found. */
export function getMeta(filename: string): ScreenshotMeta | undefined {
	return screenshotMeta.find((meta) => meta.filename === filename);
}
