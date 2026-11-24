/**
 * Draws the textures for the alternative Leaderboards looks (?look=slate, brand, quiet) as
 * pixel-art SVGs, from a seeded random generator and hand-picked colours. The default classic look
 * uses Minecraft's own textures instead (src/lib/assets/stats/minecraft, see ASSETS.md). Re-run with:
 *
 *   bun scripts/stats-textures.ts
 *
 * Tiles are 16 (or 32) texels wide and are meant to be shown at 2 screen pixels per texel, the
 * same scale as the sprites in src/lib/stats/sprites.ts.
 */
import { mkdirSync, writeFileSync } from 'node:fs';

const out = 'src/lib/assets/stats/textures';
mkdirSync(out, { recursive: true });

/** mulberry32: small, fast, seeded PRNG so the textures are reproducible. */
function rng(seed: number) {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const pick = (r: () => number, list: string[]) => list[Math.floor(r() * list.length)];

/** One <path> per colour, each texel a 1x1 square. */
function svg(w: number, h: number, px: (x: number, y: number) => string) {
	const by: Record<string, string> = {};
	for (let y = 0; y < h; y++)
		for (let x = 0; x < w; x++) {
			const c = px(x, y);
			by[c] = (by[c] ?? '') + `M${x} ${y}h1v1h-1z`;
		}
	const paths = Object.entries(by)
		.map(([c, d]) => `<path fill="${c}" d="${d}"/>`)
		.join('');
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges">${paths}</svg>\n`;
}

const write = (name: string, body: string) => writeFileSync(`${out}/${name}.svg`, body);

/** 4x4 Bayer matrix, normalised to 0..1, for ordered dithering. */
const bayer = [
	[0, 8, 2, 10],
	[12, 4, 14, 6],
	[3, 11, 1, 9],
	[15, 7, 13, 5]
].map((row) => row.map((v) => (v + 0.5) / 16));

/** Vertical ordered-dither ramp through `stops` (top to bottom). */
function ditherRamp(w: number, h: number, stops: string[]) {
	return svg(w, h, (x, y) => {
		const p = (y / (h - 1)) * (stops.length - 1);
		const i = Math.min(Math.floor(p), stops.length - 2);
		return p - i > bayer[y % 4][x % 4] ? stops[i + 1] : stops[i];
	});
}

// ---------------------------------------------------------------------------------------------
// Slate & copper: layered blue-grey slate, weathered copper plate, bright copper trim.
// ---------------------------------------------------------------------------------------------

{
	// Horizontal strata: three bands split by broken seam lines, with short lighter streaks.
	const r = rng(101);
	const band = (y: number) => (y < 5 ? 0 : y < 11 ? 1 : 2);
	const tones = [
		['#2c3138', '#2f343c', '#292d34'],
		['#31363e', '#343a43', '#2e333a'],
		['#2a2e35', '#2d3239', '#272b31']
	];
	const streakStart = Array.from({ length: 16 }, () => (r() < 0.22 ? 2 + Math.floor(r() * 3) : 0));
	write(
		'slate',
		svg(16, 16, (x, y) => {
			if (y === 4 || y === 10) return r() < 0.8 ? '#22262c' : '#3a414a';
			// A run of lighter texels, as if the layer had been chiselled.
			for (let s = 0; s < 4; s++) {
				const len = streakStart[(x - s + 16) % 16];
				if (len > s && (y * 7 + x - s) % 16 === 3) return '#3a414a';
			}
			if (r() < 0.05) return '#23272d';
			return pick(r, tones[band(y)]);
		})
	);
}

{
	// Weathered copper: verdigris speckle with the odd fleck of bare copper showing through.
	// 32x32 texels (still 2px each, so a 64px tile) so the speckle doesn't visibly repeat.
	const r = rng(211);
	const teal = ['#28594f', '#2d6458', '#244f46', '#30695c', '#2d6458'];
	write(
		'copper-plate',
		svg(32, 32, () => {
			const v = r();
			if (v < 0.025) return '#8f4f2f';
			if (v < 0.06) return '#3b7a6b';
			if (v < 0.1) return '#1f463e';
			return pick(r, teal);
		})
	);
}

{
	// Copper trim strip (16x4): highlight, two body rows, shadow; a rivet every 8 texels.
	write(
		'copper-trim',
		svg(16, 4, (x, y) => {
			if (y === 0) return '#e39a63';
			if (y === 3) return '#5e3019';
			if (x % 8 === 3) return y === 1 ? '#f4c08e' : '#7a4024';
			return (x + y) % 5 === 0 ? '#a8603a' : '#c27547';
		})
	);
}

// ---------------------------------------------------------------------------------------------
// NearVanilla colours: the site's own blue, lime and near-black, as dithered pixel fills.
// ---------------------------------------------------------------------------------------------

{
	// Night sky ramp for the header: site accent blue down to the page background.
	write(
		'brand-sky',
		ditherRamp(16, 96, ['#3b82f6', '#2563eb', '#1e3a8a', '#172554', '#0f172a', '#0d0d0d'])
	);
}

{
	// Near-black page fill with sparse, dim blue and lime specks.
	const r = rng(307);
	write(
		'brand-night',
		svg(16, 16, () => {
			const v = r();
			if (v < 0.012) return '#24360f';
			if (v < 0.03) return '#12253a';
			if (v < 0.1) return '#111417';
			return '#0d0d0d';
		})
	);
}

{
	// Two-colour rule: lime over sky, like the NEAR / VANILLA wordmark.
	write(
		'brand-stripe',
		svg(16, 4, (x, y) => {
			if (y < 2) return x % 8 === 7 && y === 1 ? '#65a30d' : '#a3e635';
			return x % 8 === 3 && y === 3 ? '#0284c7' : '#38bdf8';
		})
	);
}

// ---------------------------------------------------------------------------------------------
// Quiet pixel: a single dithered fade under the header; everything else is flat.
// ---------------------------------------------------------------------------------------------

{
	write('quiet-fade', ditherRamp(16, 8, ['#1a1a1a', '#141414', '#0d0d0d']));
}

console.log(`textures written to ${out}`);
