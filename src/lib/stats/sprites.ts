/**
 * Pixel-art sprites drawn for this site. Each row is a string; every character is one pixel,
 * looked up in the palette ('.' is transparent).
 */
export interface Sprite {
	grid: string[];
	palette: Record<string, string>;
}

/** NearVanilla's diamond mark as a pixel sprite, standing in for a server icon. */
export const logoSprite: Sprite = {
	grid: [
		'kkkkkkkkkkkkkkkk',
		'kkkkkkkBBkkkkkkk',
		'kkkkkkBLbBkkkkkk',
		'kkkkkBLbbbBkkkkk',
		'kkkkBLbkkbbBkkkk',
		'kkkBLbkkkkbbBkkk',
		'kkBLbkkkkkkbbBkk',
		'kBLbkkkkkkkkbbBk',
		'kBbbkkkkkkkkbDBk',
		'kkBbbkkkkkkbDBkk',
		'kkkBbbkkkkbDBkkk',
		'kkkkBbbkkbDBkkkk',
		'kkkkkBbbbDBkkkkk',
		'kkkkkkBbDBkkkkkk',
		'kkkkkkkBBkkkkkkk',
		'kkkkkkkkkkkkkkkk'
	],
	palette: { k: '#0d0d0d', B: '#1d4ed8', b: '#3b82f6', L: '#93c5fd', D: '#1e40af' }
};

/** One SVG path per colour, so a sprite renders as a handful of elements. */
export function spritePaths(sprite: Sprite): { fill: string; d: string }[] {
	const byColour = new Map<string, string>();
	sprite.grid.forEach((row, y) => {
		[...row].forEach((char, x) => {
			const fill = sprite.palette[char];
			if (!fill) return;
			byColour.set(fill, (byColour.get(fill) ?? '') + `M${x} ${y}h1v1h-1z`);
		});
	});
	return [...byColour].map(([fill, d]) => ({ fill, d }));
}

export function spriteSize(sprite: Sprite): { width: number; height: number } {
	return {
		width: Math.max(...sprite.grid.map((row) => row.length)),
		height: sprite.grid.length
	};
}
