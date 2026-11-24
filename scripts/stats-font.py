"""
Builds the Leaderboards pixel font, "NV Pixel", from Monocraft (SIL OFL 1.1,
https://github.com/IdreesInc/Monocraft, copyright Idrees Hassan). Monocraft declares no
Reserved Font Name; the result is renamed anyway so it isn't confused with the original.

Changes from Monocraft:
  - subset to Latin text and the punctuation the Leaderboards use, with no ligatures;
  - proportional spacing: each glyph is moved to the left edge and given an advance of its
    own width plus one font pixel (120 units), like an in-game font, instead of the fixed
    6-pixel monospace cell. Advances stay whole font pixels, so text stays on the pixel grid.

One font pixel is 120/1080 = 1/9 em, so at font-size 18px one font pixel is exactly 2px.

Usage (needs fontTools and brotli):
  python scripts/stats-font.py path/to/Monocraft.ttf
"""

import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

PIXEL = 120
SPACE_ADVANCE = 4 * PIXEL
FAMILY = 'NV Pixel'
OUT = Path('src/lib/assets/stats/fonts/nv-pixel.woff2')

UNICODES = (
	list(range(0x20, 0x7F))
	+ [0xA0, 0xB7, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2190, 0x2192]
)


def main(source: str) -> None:
	font = TTFont(source)

	options = subset.Options()
	options.layout_features = []
	options.hinting = False
	options.notdef_outline = True
	options.name_IDs = ['*']
	subsetter = subset.Subsetter(options)
	subsetter.populate(unicodes=UNICODES)
	subsetter.subset(font)

	glyf = font['glyf']
	hmtx = font['hmtx']
	off: list[str] = []
	for name in font.getGlyphOrder():
		glyph = glyf[name]
		if glyph.isComposite():
			raise SystemExit(f'composite glyph {name} needs decomposing first')
		if glyph.numberOfContours <= 0:
			hmtx[name] = (SPACE_ADVANCE, 0)
			continue
		glyph.recalcBounds(glyf)
		# Monocraft centres some glyphs in their cell at half-pixel offsets; moving every
		# glyph to x=0 puts all of them back on the pixel grid.
		glyph.coordinates.translate((-glyph.xMin, 0))
		glyph.recalcBounds(glyf)
		if name != '.notdef' and any(x % PIXEL or y % PIXEL for x, y in glyph.coordinates):
			off.append(name)
		hmtx[name] = (glyph.xMax + PIXEL, 0)

	if off:
		raise SystemExit(f'off the pixel grid: {", ".join(off)}')

	for record in font['name'].names:
		if record.nameID in (1, 16):
			record.string = FAMILY
		elif record.nameID in (4, 18):
			record.string = FAMILY
		elif record.nameID == 6:
			record.string = FAMILY.replace(' ', '')
		elif record.nameID == 3:
			record.string = f'{FAMILY}; derived from Monocraft'
	font['post'].isFixedPitch = 0

	OUT.parent.mkdir(parents=True, exist_ok=True)
	font.flavor = 'woff2'
	font.save(OUT)
	print(f'wrote {OUT} ({OUT.stat().st_size} bytes)')


if __name__ == '__main__':
	if len(sys.argv) != 2:
		raise SystemExit(__doc__)
	main(sys.argv[1])
