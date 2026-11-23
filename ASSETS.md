# Third-party assets

The Leaderboards section (`/stats`) uses assets made by others. This file lists each one, where it
came from, and the licence it is used under. The site's own code and the remaining images are
ours.

The credits below also appear in the Leaderboards footer (`src/routes/stats/+layout.svelte`).

## Minecraft textures and item icons (Mojang AB / Microsoft)

Minecraft textures and item icons © Mojang AB / Microsoft. All rights in them stay with Mojang
and Microsoft. They are used on this non-commercial community site under Mojang's
[Usage Guidelines](https://www.minecraft.net/en-us/usage-guidelines), which cover fan sites and
servers and require them not to suggest any link to Mojang or Microsoft. As the guidelines ask,
the Leaderboards footer carries this line:

> NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.

| Files                                                                | What                                                  | Source                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/assets/stats/minecraft/{dirt,stone,stonebrick,bedrock}.png` | Dirt, stone, stone brick and bedrock background tiles | Copied unchanged from MinecraftStats (`www/img/bg`), which ships them at 64x64 (4x) and darkened                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `src/lib/assets/stats/minecraft/grass_side_dappled_forest.png`       | Grass strip at the top of the page                    | Built by `scripts/stats-grass.py` from the vanilla Minecraft 26.3 client: `block/grass_block_side_overlay.png` tinted with the dappled forest biome's grass colour (`#df6827`, `effects.grass_color` in `data/minecraft/worldgen/biome/dappled_forest.json`) over `block/grass_block_side.png`, as the game draws it, then scaled 4x like the other tiles. The grass fringe (the overlay's pixels) stays at full vanilla brightness; the dirt below it is darkened to 40% to match the MinecraftStats dirt strip underneath |
| `static/images/stats/award-icons/*.png`                              | One icon per award                                    | Built by `scripts/stats-icons.py`: either MinecraftStats' icon for the matching award (`www/img/award-icons`) or a texture from the vanilla Minecraft 26.3 client (`assets/minecraft/textures`). The script lists each award's source                                                                                                                                                                                                                                                                                       |

## MinecraftStats (CC BY-SA 4.0)

[MinecraftStats](https://github.com/pdinklag/MinecraftStats) by Patrick Dinklage is licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Its author asks for a visible
link to the repository, which the Leaderboards footer has.

Used from it:

- the dirt, stone, stone brick and bedrock tiles above, unchanged;
- award icons for the awards it also has. `scripts/stats-icons.py` trims their transparent
  margins, centres them on an 18x18 canvas, undoes integer upscales, doubles its 8x8 mob faces,
  and halves its 32px bed render. Those adapted icons are shared under CC BY-SA 4.0 as well.

Not used: its code, CSS, HTML, localisation strings, and the Minecraftia font (see below). The
Leaderboards layout was written for this site, following how MinecraftStats looked.

## FatCow "Farm-Fresh" icons (CC BY 3.0)

`src/lib/assets/stats/fatcow/` holds the gold, silver and bronze medal and crown icons from
[FatCow Farm-Fresh](https://www.fatcow.com/free-icons) v3.92, licensed under
[CC BY 3.0 US](https://creativecommons.org/licenses/by/3.0/us/). They are copied unchanged from
MinecraftStats (`www/img/fatcow`, which includes FatCow's readme with the licence).

## NV Pixel font (SIL Open Font License 1.1)

`src/lib/assets/stats/fonts/nv-pixel.woff2` is a modified version of
[Monocraft](https://github.com/IdreesInc/Monocraft) by Idrees Hassan, licensed under the
[SIL Open Font License 1.1](https://openfontlicense.org). `scripts/stats-font.py` subsets it to
Latin and re-spaces it proportionally. The licence text is in
`src/lib/assets/stats/fonts/OFL.txt`.

MinecraftStats used Minecraftia by Andrew Tyler, which is free for personal use only and needs a
paid licence otherwise. It is not used here.

## Player heads

Player faces are loaded at runtime from [mc-heads.net](https://mc-heads.net). They are players'
own skins and are not stored in this repository.
