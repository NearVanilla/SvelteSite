export interface Builder {
	name: string;
	flag?: string; // Unicode emoji flag, e.g. '🇬🇧'. Omit to show the UN flag (🇺🇳) as a "rest of world" indicator.
}

export interface ScreenshotMeta {
	filename: string; // webp filename without extension
	buildName: string;
	builders: Builder[];
}

export const screenshotMeta: ScreenshotMeta[] = [
	{
		filename: '2026-03-14_01.34.02_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder One' }]
	},
	{
		filename: '2026-03-14_01.34.11_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Two', flag: '🇬🇧' }]
	},
	{
		filename: '2026-03-14_01.34.30_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Three', flag: '🇩🇪' }]
	},
	{
		filename: '2026-03-14_01.35.07_4K',
		buildName: 'Placeholder Build',
		builders: [
			{ name: 'Builder Four', flag: '🇫🇷' },
			{ name: 'Builder Five', flag: '🇨🇦' }
		]
	},
	{
		filename: '2026-03-14_01.35.47_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Six', flag: '🇦🇺' }]
	},
	{
		filename: '2026-03-14_01.36.03_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Seven', flag: '🇳🇱' }]
	},
	{
		filename: '2026-03-14_01.36.18_4K',
		buildName: 'Placeholder Build',
		builders: [
			{ name: 'Builder Eight', flag: '🇸🇪' },
			{ name: 'Builder Nine', flag: '🇳🇴' }
		]
	},
	{
		filename: '2026-03-14_01.36.37_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Ten', flag: '🇧🇷' }]
	},
	{
		filename: '2026-03-14_01.37.04_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Eleven', flag: '🇵🇱' }]
	},
	{
		filename: '2026-03-14_01.37.10_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Twelve', flag: '🇿🇦' }]
	},
	{
		filename: '2026-03-14_01.37.24_4K',
		buildName: 'Placeholder Build',
		builders: [
			{ name: 'Builder Thirteen', flag: '🇯🇵' },
			{ name: 'Builder Fourteen', flag: '🇰🇷' }
		]
	},
	{
		filename: '2026-03-14_01.37.52_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Fifteen', flag: '🇲🇽' }]
	},
	{
		filename: '2026-03-14_01.38.09_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Sixteen', flag: '🇮🇹' }]
	},
	{
		filename: '2026-03-14_01.39.23_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Seventeen', flag: '🇪🇸' }]
	},
	{
		filename: '2026-03-14_01.39.50_4K',
		buildName: 'Placeholder Build',
		builders: [
			{ name: 'Builder Eighteen', flag: '🇵🇹' },
			{ name: 'Builder Nineteen', flag: '🇬🇷' }
		]
	},
	{
		filename: '2026-03-14_01.40.20_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Twenty', flag: '🇨🇭' }]
	},
	{
		filename: '2026-03-14_01.40.31_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Twenty-One', flag: '🇦🇹' }]
	},
	{
		filename: '2026-03-14_01.41.20_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Twenty-Two', flag: '🇧🇪' }]
	},
	{
		filename: '2026-03-14_01.42.02_4K',
		buildName: 'Placeholder Build',
		builders: [{ name: 'Builder Twenty-Three', flag: '🇩🇰' }]
	}
];

/** Look up metadata by filename (without extension). Returns undefined if not found. */
export function getMeta(filename: string): ScreenshotMeta | undefined {
	return screenshotMeta.find((m) => m.filename === filename);
}
