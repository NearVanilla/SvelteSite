"""
Copies one 18x18 icon per Leaderboards award into static/images/stats/award-icons/<award-id>.png.

Icons are Minecraft item and block textures (Mojang). Each award's source is listed in ICONS:
  mcstats:<id>  the icon MinecraftStats used for its matching award
                (www/img/award-icons/<id>.png in https://github.com/pdinklag/MinecraftStats)
  vanilla:<path> a texture from the vanilla client jar (assets/minecraft/textures/<path>.png),
                for awards MinecraftStats doesn't have
Animated textures are cut to their first frame, integer upscales are undone, empty margins are
trimmed, 8x8 mob faces are doubled (nearest neighbour) and the result is centred on 18x18.
The one image too big for that (MinecraftStats' 32px bed render) is halved with a box filter. See ASSETS.md for credits and licences.

Usage (needs Pillow):
  python scripts/stats-icons.py <MinecraftStats www dir> <client textures dir>
where <client textures dir> is assets/minecraft/textures extracted from the client jar.
The award list must match src/lib/stats/awards.ts; the script fails on any gap.
"""

import json
import subprocess
import sys
from pathlib import Path

from PIL import Image

OUT = Path('static/images/stats/award-icons')
SIZE = 18  # MinecraftStats mixes 16x16 item icons and 18x18 effect-style icons

ICONS = {
    'diamond-seeker': 'mcstats:mine_diamond_ore',
    'emerald-hunter': 'mcstats:mine_emerald_ore',
    'debris-diver': 'mcstats:mine_ancient_debris',
    'iron-vein': 'mcstats:mine_iron_ore',
    'gold-rush': 'mcstats:mine_gold_ore',
    'copper-cutter': 'mcstats:mine_copper_ore',
    'coal-face': 'mcstats:mine_coal_ore',
    'red-dust': 'mcstats:mine_redstone_ore',
    'deep-blue': 'mcstats:mine_lapis_ore',
    'quartz-quarrier': 'mcstats:mine_nether_quartz_ore',
    'stone-breaker': 'mcstats:mine_stone',
    'netherrack-ripper': 'vanilla:block/netherrack',
    'obsidian-breaker': 'mcstats:mine_obsidian',
    'sand-shoveller': 'vanilla:block/sand',
    'dirt-mover': 'mcstats:mine_ground',
    'gravel-sifter': 'vanilla:block/gravel',
    'geode-cracker': 'mcstats:mine_amethyst',
    'sculk-silencer': 'vanilla:block/sculk_shrieker_top',
    'glowstone-gatherer': 'vanilla:item/glowstone_dust',
    'ice-breaker': 'mcstats:mine_ice',
    'end-excavator': 'vanilla:block/end_stone',
    'blackstone-breaker': 'vanilla:block/blackstone',
    'pickaxe-graveyard': 'vanilla:item/iron_pickaxe',
    'shovel-graveyard': 'vanilla:item/iron_shovel',
    'monster-slayer': 'mcstats:kill_any',
    'duellist': 'mcstats:craft_sword',
    'zombie-bane': 'mcstats:kill_zombie',
    'bone-collector': 'mcstats:kill_skeleton',
    'creeper-defuser': 'mcstats:kill_creeper',
    'spider-squasher': 'mcstats:kill_spider',
    'void-stalker': 'mcstats:kill_enderman',
    'blaze-extinguisher': 'mcstats:kill_blaze',
    'ghast-buster': 'mcstats:kill_ghast',
    'witch-hunter': 'mcstats:kill_witch',
    'raid-breaker': 'mcstats:kill_illagers',
    'monument-raider': 'mcstats:kill_guardian',
    'bastion-breaker': 'mcstats:kill_piglin_brute',
    'skull-taker': 'mcstats:kill_wither_skeleton',
    'night-watch': 'mcstats:kill_phantom',
    'slime-splitter': 'mcstats:kill_magma_cube',
    'shell-cracker': 'mcstats:kill_shulker',
    'dragon-slayer': 'mcstats:kill_ender_dragon',
    'wither-slayer': 'vanilla:item/nether_star',
    'deep-dark-hero': 'mcstats:kill_warden',
    'breeze-breaker': 'vanilla:item/breeze_rod',
    'swamp-sweeper': 'vanilla:item/bogged_spawn_egg',
    'heartstopper': 'vanilla:item/creaking_spawn_egg',
    'sun-dried': 'vanilla:item/parched_spawn_egg',
    'tide-turner': 'vanilla:item/zombie_nautilus_spawn_egg',
    'dune-reaper': 'vanilla:item/camel_husk_spawn_egg',
    'pest-control': 'mcstats:kill_endermite',
    'heavy-hitter': 'mcstats:damage_dealt',
    'punching-bag': 'mcstats:damage_taken',
    'shield-wall': 'vanilla:mob_effect/resistance',
    'respawn-regular': 'mcstats:death',
    'blown-up': 'vanilla:item/gunpowder',
    'mace-smasher': 'vanilla:item/mace',
    'gust-thrower': 'vanilla:item/wind_charge',
    'lancer': 'vanilla:item/iron_spear',
    'sharpshooter': 'mcstats:use_bow',
    'bolt-thrower': 'mcstats:use_crossbow',
    'trident-hurler': 'vanilla:item/trident',
    'bullseye': 'vanilla:block/target_top',
    'village-defender': 'vanilla:mob_effect/hero_of_the_village',
    'sword-graveyard': 'vanilla:item/stone_sword',
    'wanderer': 'mcstats:walk',
    'sprinter': 'mcstats:sprint',
    'sneaker': 'mcstats:crouch',
    'swimmer': 'mcstats:swim',
    'seabed-stroller': 'mcstats:dive',
    'wader': 'mcstats:walk_on_water',
    'up-and-away': 'vanilla:item/feather',
    'climber': 'mcstats:climb',
    'free-faller': 'mcstats:fall',
    'elytra-ace': 'mcstats:aviate',
    'sailor': 'mcstats:ride_boat',
    'rail-rider': 'mcstats:ride_minecart',
    'equestrian': 'mcstats:ride_horse',
    'pig-jockey': 'mcstats:ride_pig',
    'lava-strider': 'mcstats:ride_strider',
    'cloud-rider': 'vanilla:item/happy_ghast_spawn_egg',
    'shell-rider': 'vanilla:item/nautilus_shell',
    'bunny-hopper': 'mcstats:jump',
    'biome-collector': 'mcstats:biomes',
    'pearl-thrower': 'mcstats:use_ender_pearl',
    'rocketeer': 'mcstats:use_fireworks',
    'unbroken': 'mcstats:time_since_death',
    'matchmaker': 'mcstats:breed',
    'angler': 'mcstats:kill_fish',
    'wheat-harvester': 'vanilla:item/wheat',
    'root-cellar': 'vanilla:item/carrot',
    'cane-cutter': 'mcstats:harvest_sugar',
    'patch-picker': 'vanilla:block/pumpkin_side',
    'wart-farmer': 'mcstats:harvest_nether_wart',
    'cocoa-picker': 'vanilla:item/cocoa_beans',
    'berry-picker': 'mcstats:collect_berries',
    'kelp-cutter': 'mcstats:mine_kelp',
    'bamboo-chopper': 'mcstats:harvest_bamboo',
    'lumberjack': 'mcstats:mine_wood',
    'pale-forester': 'vanilla:block/pale_oak_log',
    'green-thumb': 'vanilla:item/bone_meal',
    'seed-sower': 'vanilla:item/wheat_seeds',
    'sheep-shearer': 'mcstats:use_shears',
    'butcher': 'mcstats:kill_cow',
    'egg-collector': 'mcstats:use_egg',
    'scute-collector': 'vanilla:item/armadillo_scute',
    'hoe-graveyard': 'vanilla:item/iron_hoe',
    'axe-graveyard': 'vanilla:item/iron_axe',
    'automator': 'vanilla:block/crafter_north',
    'enchanter': 'mcstats:enchant',
    'workbench-regular': 'vanilla:block/crafting_table_front',
    'anvil-smith': 'mcstats:interact_anvil',
    'smithy': 'vanilla:block/smithing_table_front',
    'disenchanter': 'mcstats:interact_grindstone',
    'brewer': 'mcstats:interact_brewing_stand',
    'smelter': 'mcstats:interact_blast_furnace',
    'mason': 'mcstats:interact_stonecutter',
    'weaver': 'mcstats:interact_loom',
    'cartographer': 'mcstats:interact_cartography',
    'trader': 'mcstats:trade',
    'torchbearer': 'mcstats:place_torch',
    'baker': 'mcstats:craft_bread',
    'railwright': 'mcstats:place_rails',
    'orchard-alchemist': 'vanilla:item/golden_apple',
    'beacon-builder': 'mcstats:craft_beacon',
    'electrician': 'vanilla:block/copper_bulb_lit',
    'pyrotechnician': 'mcstats:use_fireworks',
    'name-giver': 'vanilla:item/name_tag',
    'librarian': 'mcstats:craft_bookshelf',
    'tinkerer': 'mcstats:place_piston',
    'bricklayer': 'vanilla:block/stone_bricks',
    'glazier': 'mcstats:place_glass',
    'lamplighter': 'mcstats:place_lantern',
    'scaffolder': 'mcstats:place_scaffolding',
    'track-layer': 'mcstats:place_rails',
    'carpenter': 'vanilla:block/oak_planks',
    'concrete-jungle': 'vanilla:block/white_concrete',
    'terracotta-tiler': 'vanilla:block/terracotta',
    'woolly-builder': 'mcstats:craft_wool',
    'coppersmith': 'vanilla:block/copper_block',
    'redstone-engineer': 'mcstats:place_electrics',
    'decorator': 'vanilla:item/item_frame',
    'florist': 'mcstats:pot_flower',
    'bucket-brigade': 'mcstats:use_lava_bucket',
    'quartz-architect': 'vanilla:block/quartz_block_side',
    'cobble-stacker': 'vanilla:block/cobblestone',
    'dedicated': 'mcstats:play',
    'sleepyhead': 'mcstats:sleep',
    'chatterbox': 'vanilla:item/writable_book',
    'chest-rummager': 'mcstats:open_container',
    'ender-stasher': 'mcstats:craft_ender_chest',
    'shulker-packer': 'vanilla:block/shulker_box',
    'barrel-diver': 'vanilla:block/barrel_top',
    'bell-ringer': 'mcstats:ring_bell',
    'musician': 'mcstats:noteblock',
    'disc-jockey': 'mcstats:play_record',
    'cake-fiend': 'vanilla:item/cake',
    'litterbug': 'mcstats:drop',
    'coming-and-going': 'vanilla:item/oak_door',
    'archaeologist': 'vanilla:item/brush',
    'vault-cracker': 'vanilla:item/trial_key',
    'ominous-sipper': 'vanilla:item/ominous_bottle',
    'raid-starter': 'mcstats:trigger_raid',
    'second-chance': 'mcstats:use_totem',
    'golden-gobbler': 'vanilla:item/golden_apple',
    'lookout': 'mcstats:craft_spyglass',
    'horn-blower': 'mcstats:use_goat_horn',
    'spring-cleaner': 'vanilla:item/cauldron',
    'nicknamer': 'vanilla:item/name_tag',
    'wrangler': 'vanilla:item/lead',
    'tnt-enthusiast': 'mcstats:craft_tnt',
    'night-owl': 'mcstats:time_since_sleep',
}


def upscale_factor(image: Image.Image) -> int:
    """Largest k such that the image is made of k x k blocks of one colour (an integer upscale)."""
    for k in range(min(image.size) // 8, 1, -1):
        if image.width % k or image.height % k:
            continue
        small = image.resize((image.width // k, image.height // k), Image.NEAREST)
        if small.resize(image.size, Image.NEAREST).tobytes() == image.tobytes():
            return k
    return 1


def load(source: str, mcstats: Path, vanilla: Path) -> Image.Image:
    kind, name = source.split(':', 1)
    path = mcstats / 'img' / 'award-icons' / f'{name}.png' if kind == 'mcstats' else vanilla / f'{name}.png'
    image = Image.open(path).convert('RGBA')
    if image.height > image.width and image.height % image.width == 0:
        image = image.crop((0, 0, image.width, image.width))  # first frame of an animation
    k = upscale_factor(image)
    if k > 1:
        image = image.resize((image.width // k, image.height // k), Image.NEAREST)
    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)
    if max(image.size) <= 8:
        image = image.resize((image.width * 2, image.height * 2), Image.NEAREST)  # 8x8 mob faces
    if SIZE < max(image.size) <= SIZE * 2:
        image = image.reduce(2)  # MinecraftStats' 32px isometric bed render (Sleepyhead)
    if image.width > SIZE or image.height > SIZE:
        raise SystemExit(f'{path} is {image.size} after trimming, larger than {SIZE}x{SIZE}')
    canvas = Image.new('RGBA', (SIZE, SIZE))
    canvas.paste(image, ((SIZE - image.width) // 2, (SIZE - image.height) // 2))
    return canvas


def award_ids() -> list[str]:
    script = "const { awards } = await import('./src/lib/stats/awards.ts'); console.log(JSON.stringify(awards.map((a) => a.id)));"
    return json.loads(subprocess.run(['bun', '-e', script], capture_output=True, text=True, check=True).stdout)


def main(mcstats: str, vanilla: str) -> None:
    ids = award_ids()
    missing = [i for i in ids if i not in ICONS]
    unknown = [i for i in ICONS if i not in ids]
    if missing or unknown:
        raise SystemExit(f'missing icons: {missing}; icons for unknown awards: {unknown}')
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob('*.png'):
        old.unlink()
    for award, source in ICONS.items():
        load(source, Path(mcstats), Path(vanilla)).save(OUT / f'{award}.png', optimize=True)
    print(f'wrote {len(ICONS)} icons to {OUT}')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])
