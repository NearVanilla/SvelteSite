"""
Builds the grass strip at the top of the classic Leaderboards look from the Minecraft client jar:
a grass block's side as it looks in the dappled forest biome.

The game draws a grass block's side in two layers (assets/minecraft/models/block/grass_block.json):
  1. block/grass_block_side.png, untinted (dirt with a default-green fringe);
  2. block/grass_block_side_overlay.png, a grey fringe multiplied by the biome's grass colour.
The dappled forest's grass colour is "effects.grass_color" in
data/minecraft/worldgen/biome/dappled_forest.json (#df6827 in 26.3; the biome has no grass colour
modifier). This script draws layer 2 over layer 1 the same way and scales the result 4x (nearest
neighbour) to 64x64, like the other tiles.

Brightness: the grass fringe (every pixel the overlay covers, picked out by the overlay's own
alpha) stays at full vanilla brightness. The dirt below it is darkened to 40%, the same as the
MinecraftStats dirt strip directly underneath (its dirt.png is vanilla dirt x 0.40), so the two
strips meet without a seam.

Usage (needs Pillow):
  python scripts/stats-grass.py path/to/client.jar
"""

import io
import json
import sys
import zipfile
from pathlib import Path

from PIL import Image

BIOME = 'dappled_forest'
OUT = Path(f'src/lib/assets/stats/minecraft/grass_side_{BIOME}.png')
DIRT_BRIGHTNESS = 0.4  # matches MinecraftStats' dirt.png (vanilla dirt x 0.40)
SCALE = 4  # 16 texels shown as 64px, like the other tiles


def read_png(jar: zipfile.ZipFile, path: str) -> Image.Image:
    return Image.open(io.BytesIO(jar.read(path))).convert('RGBA')


def grass_colour(jar: zipfile.ZipFile) -> tuple[int, int, int]:
    biome = json.loads(jar.read(f'data/minecraft/worldgen/biome/{BIOME}.json'))
    effects = biome.get('effects', {})
    if 'grass_color_modifier' in effects:
        raise SystemExit(f'{BIOME} has a grass colour modifier; this script does not apply those')
    colour = effects['grass_color']
    value = int(colour.lstrip('#'), 16) if isinstance(colour, str) else int(colour)
    return (value >> 16) & 0xFF, (value >> 8) & 0xFF, value & 0xFF


def main(jar_path: str) -> None:
    with zipfile.ZipFile(jar_path) as jar:
        tint = grass_colour(jar)
        side = read_png(jar, 'assets/minecraft/textures/block/grass_block_side.png')
        overlay = read_png(jar, 'assets/minecraft/textures/block/grass_block_side_overlay.png')

    # Tint the overlay the way the game does: multiply each channel by the grass colour.
    r, g, b, a = overlay.split()
    tinted = Image.merge(
        'RGBA',
        (
            r.point(lambda v: v * tint[0] // 255),
            g.point(lambda v: v * tint[1] // 255),
            b.point(lambda v: v * tint[2] // 255),
            a
        )
    )
    tile = Image.alpha_composite(side, tinted).convert('RGB')

    # Keep the grass fringe bright and darken the dirt: the overlay's alpha marks the grass.
    dark = Image.eval(tile, lambda v: round(v * DIRT_BRIGHTNESS))
    tile = Image.composite(tile, dark, a)
    tile = tile.resize((tile.width * SCALE, tile.height * SCALE), Image.NEAREST)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    tile.save(OUT, optimize=True)
    print(f'wrote {OUT} ({tile.width}x{tile.height}), {BIOME} grass colour #%02x%02x%02x' % tint)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(sys.argv[1])
