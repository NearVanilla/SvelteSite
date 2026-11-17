import { criteriaCount, stat, sum } from './readers';
import type { Award, AwardCategory, Reader, Unit } from './types';

/** Display order and labels for award categories. */
export const categoryLabels: Record<AwardCategory, string> = {
	mining: 'Mining',
	combat: 'Combat',
	travel: 'Travel',
	farming: 'Farming',
	crafting: 'Crafting',
	building: 'Building',
	misc: 'Miscellaneous'
};

const COLOURS = [
	'white',
	'light_gray',
	'gray',
	'black',
	'brown',
	'red',
	'orange',
	'yellow',
	'lime',
	'green',
	'cyan',
	'light_blue',
	'blue',
	'purple',
	'magenta',
	'pink'
];
const WOODS = [
	'oak',
	'spruce',
	'birch',
	'jungle',
	'acacia',
	'dark_oak',
	'mangrove',
	'cherry',
	'pale_oak'
];
const TOOL_TIERS = ['wooden', 'stone', 'copper', 'iron', 'golden', 'diamond', 'netherite'];

const mc = (id: string) => `minecraft:${id}`;
const ids = (list: string[]) => list.map(mc);

const custom = (key: string) => stat(mc('custom'), mc(key));
const customSum = (keys: string[]) => sum(mc('custom'), ids(keys));
const mined = (...keys: string[]) => sum(mc('mined'), ids(keys));
const killed = (...keys: string[]) => sum(mc('killed'), ids(keys));
const killedBy = (...keys: string[]) => sum(mc('killed_by'), ids(keys));
const used = (...keys: string[]) => sum(mc('used'), ids(keys));
const crafted = (...keys: string[]) => sum(mc('crafted'), ids(keys));
const broken = (...keys: string[]) => sum(mc('broken'), ids(keys));
const pickedUp = (...keys: string[]) => sum(mc('picked_up'), ids(keys));

type Entry = [id: string, name: string, description: string, read: Reader, unit?: Unit];

function group(category: AwardCategory, entries: Entry[]): Award[] {
	return entries.map(([id, name, description, read, unit = 'count']) => ({
		id,
		name,
		description,
		category,
		unit,
		read
	}));
}

const mining = group('mining', [
	[
		'diamond-seeker',
		'Diamond Seeker',
		'Diamond ore broken.',
		mined('diamond_ore', 'deepslate_diamond_ore')
	],
	[
		'emerald-hunter',
		'Emerald Hunter',
		'Emerald ore broken.',
		mined('emerald_ore', 'deepslate_emerald_ore')
	],
	[
		'debris-diver',
		'Debris Diver',
		'Ancient debris dug out of the Nether.',
		mined('ancient_debris')
	],
	[
		'iron-vein',
		'Iron Vein',
		'Iron ore broken.',
		mined('iron_ore', 'deepslate_iron_ore', 'raw_iron_block')
	],
	[
		'gold-rush',
		'Gold Rush',
		'Gold ore broken, including Nether gold.',
		mined('gold_ore', 'deepslate_gold_ore', 'nether_gold_ore', 'raw_gold_block')
	],
	[
		'copper-cutter',
		'Copper Cutter',
		'Copper ore broken.',
		mined('copper_ore', 'deepslate_copper_ore', 'raw_copper_block')
	],
	['coal-face', 'Coal Face', 'Coal ore broken.', mined('coal_ore', 'deepslate_coal_ore')],
	['red-dust', 'Red Dust', 'Redstone ore broken.', mined('redstone_ore', 'deepslate_redstone_ore')],
	['deep-blue', 'Deep Blue', 'Lapis lazuli ore broken.', mined('lapis_ore', 'deepslate_lapis_ore')],
	['quartz-quarrier', 'Quartz Quarrier', 'Nether quartz ore broken.', mined('nether_quartz_ore')],
	[
		'stone-breaker',
		'Stone Breaker',
		'Stone, deepslate and their cousins broken.',
		mined('stone', 'deepslate', 'tuff', 'granite', 'diorite', 'andesite', 'calcite')
	],
	['netherrack-ripper', 'Netherrack Ripper', 'Netherrack broken.', mined('netherrack')],
	[
		'obsidian-breaker',
		'Obsidian Breaker',
		'Obsidian and crying obsidian broken.',
		mined('obsidian', 'crying_obsidian')
	],
	['sand-shoveller', 'Sand Shoveller', 'Sand and red sand dug.', mined('sand', 'red_sand')],
	[
		'dirt-mover',
		'Dirt Mover',
		'Dirt, grass and mud dug.',
		mined('dirt', 'grass_block', 'coarse_dirt', 'rooted_dirt', 'mud')
	],
	['gravel-sifter', 'Gravel Sifter', 'Gravel dug.', mined('gravel')],
	['geode-cracker', 'Geode Cracker', 'Amethyst clusters harvested.', mined('amethyst_cluster')],
	[
		'sculk-silencer',
		'Sculk Silencer',
		'Sculk blocks, sensors and shriekers broken.',
		mined(
			'sculk',
			'sculk_sensor',
			'calibrated_sculk_sensor',
			'sculk_shrieker',
			'sculk_catalyst',
			'sculk_vein'
		)
	],
	['glowstone-gatherer', 'Glowstone Gatherer', 'Glowstone broken.', mined('glowstone')],
	[
		'ice-breaker',
		'Ice Breaker',
		'Ice of every kind broken.',
		mined('ice', 'packed_ice', 'blue_ice')
	],
	['end-excavator', 'End Excavator', 'End stone broken.', mined('end_stone')],
	[
		'blackstone-breaker',
		'Basalt Basher',
		'Blackstone and basalt broken.',
		mined('blackstone', 'basalt', 'smooth_basalt')
	],
	[
		'pickaxe-graveyard',
		'Pickaxe Graveyard',
		'Pickaxes worn out.',
		broken(...TOOL_TIERS.map((t) => `${t}_pickaxe`))
	],
	[
		'shovel-graveyard',
		'Spade Spender',
		'Shovels worn out.',
		broken(...TOOL_TIERS.map((t) => `${t}_shovel`))
	]
]);

const combat = group('combat', [
	['monster-slayer', 'Monster Slayer', 'Mobs defeated of any kind.', custom('mob_kills')],
	['duellist', 'Duellist', 'Other players defeated.', custom('player_kills')],
	[
		'zombie-bane',
		'Zombie Bane',
		'Zombies, husks and drowned defeated.',
		killed('zombie', 'zombie_villager', 'husk', 'drowned')
	],
	[
		'bone-collector',
		'Bone Collector',
		'Skeletons, strays and bogged defeated.',
		killed('skeleton', 'stray', 'bogged')
	],
	[
		'creeper-defuser',
		'Creeper Defuser',
		'Creepers stopped before they went bang.',
		killed('creeper')
	],
	[
		'spider-squasher',
		'Spider Squasher',
		'Spiders and cave spiders defeated.',
		killed('spider', 'cave_spider')
	],
	['void-stalker', 'Void Stalker', 'Endermen defeated.', killed('enderman')],
	['blaze-extinguisher', 'Blaze Extinguisher', 'Blazes put out.', killed('blaze')],
	['ghast-buster', 'Ghast Buster', 'Ghasts brought down.', killed('ghast')],
	['witch-hunter', 'Witch Hunter', 'Witches defeated.', killed('witch')],
	[
		'raid-breaker',
		'Raid Breaker',
		'Pillagers, vindicators, evokers and ravagers defeated.',
		killed('pillager', 'vindicator', 'evoker', 'ravager')
	],
	[
		'monument-raider',
		'Monument Raider',
		'Guardians and elder guardians defeated.',
		killed('guardian', 'elder_guardian')
	],
	[
		'bastion-breaker',
		'Bastion Breaker',
		'Piglin brutes and hoglins defeated.',
		killed('piglin_brute', 'hoglin')
	],
	['skull-taker', 'Skull Taker', 'Wither skeletons defeated.', killed('wither_skeleton')],
	['night-watch', 'Night Watch', 'Phantoms shot out of the sky.', killed('phantom')],
	[
		'slime-splitter',
		'Slime Splitter',
		'Slimes and magma cubes split.',
		killed('slime', 'magma_cube')
	],
	['shell-cracker', 'Shell Cracker', 'Shulkers defeated.', killed('shulker')],
	['dragon-slayer', 'Dragon Slayer', 'Ender dragons slain.', killed('ender_dragon')],
	['wither-slayer', 'Wither Slayer', 'Withers destroyed.', killed('wither')],
	['deep-dark-hero', 'Deep Dark Hero', 'Wardens defeated. Brave or foolish?', killed('warden')],
	['breeze-breaker', 'Breeze Breaker', 'Breezes defeated in the trial chambers.', killed('breeze')],
	['swamp-sweeper', 'Swamp Sweeper', 'Bogged defeated.', killed('bogged')],
	['heartstopper', 'Heartstopper', 'Creakings put to rest.', killed('creaking')],
	['sun-dried', 'Sun Dried', 'Parched defeated.', killed('parched')],
	['tide-turner', 'Tide Turner', 'Zombie nautiluses defeated.', killed('zombie_nautilus')],
	['dune-reaper', 'Dune Reaper', 'Camel husks defeated.', killed('camel_husk')],
	[
		'pest-control',
		'Pest Control',
		'Silverfish and endermites squashed.',
		killed('silverfish', 'endermite')
	],
	['heavy-hitter', 'Heavy Hitter', 'Damage dealt.', custom('damage_dealt'), 'health'],
	['punching-bag', 'Punching Bag', 'Damage taken.', custom('damage_taken'), 'health'],
	[
		'shield-wall',
		'Shield Wall',
		'Damage blocked with a shield.',
		custom('damage_blocked_by_shield'),
		'health'
	],
	['respawn-regular', 'Respawn Regular', 'Deaths. It happens to everyone.', custom('deaths')],
	['blown-up', 'Blown Up', 'Deaths to creepers.', killedBy('creeper')],
	['mace-smasher', 'Mace Smasher', 'Mace swings.', used('mace')],
	['gust-thrower', 'Gust Thrower', 'Wind charges thrown.', used('wind_charge')],
	['lancer', 'Lancer', 'Spear attacks.', used(...TOOL_TIERS.map((t) => `${t}_spear`))],
	['sharpshooter', 'Sharpshooter', 'Arrows loosed from a bow.', used('bow')],
	['bolt-thrower', 'Bolt Thrower', 'Crossbow shots.', used('crossbow')],
	['trident-hurler', 'Trident Hurler', 'Trident throws and stabs.', used('trident')],
	['bullseye', 'Bullseye', 'Target blocks hit.', custom('target_hit')],
	['village-defender', 'Village Defender', 'Raids won.', custom('raid_win')],
	[
		'sword-graveyard',
		'Blade Breaker',
		'Swords worn out.',
		broken(...TOOL_TIERS.map((t) => `${t}_sword`))
	]
]);

const travel = group('travel', [
	['wanderer', 'Wanderer', 'Distance walked.', custom('walk_one_cm'), 'distance'],
	['sprinter', 'Sprinter', 'Distance sprinted.', custom('sprint_one_cm'), 'distance'],
	['sneaker', 'Sneaker', 'Distance crouch-walked.', custom('crouch_one_cm'), 'distance'],
	['swimmer', 'Swimmer', 'Distance swum.', custom('swim_one_cm'), 'distance'],
	[
		'seabed-stroller',
		'Seabed Stroller',
		'Distance walked underwater.',
		custom('walk_under_water_one_cm'),
		'distance'
	],
	[
		'wader',
		'Wader',
		'Distance walked through shallow water.',
		custom('walk_on_water_one_cm'),
		'distance'
	],
	['up-and-away', 'Up and Away', 'Distance flown without wings.', custom('fly_one_cm'), 'distance'],
	[
		'climber',
		'Climber',
		'Distance climbed up ladders and vines.',
		custom('climb_one_cm'),
		'distance'
	],
	['free-faller', 'Free Faller', 'Distance fallen.', custom('fall_one_cm'), 'distance'],
	[
		'elytra-ace',
		'Elytra Ace',
		'Distance glided with an elytra.',
		custom('aviate_one_cm'),
		'distance'
	],
	['sailor', 'Sailor', 'Distance travelled by boat.', custom('boat_one_cm'), 'distance'],
	[
		'rail-rider',
		'Rail Rider',
		'Distance travelled by minecart.',
		custom('minecart_one_cm'),
		'distance'
	],
	['equestrian', 'Equestrian', 'Distance ridden on horseback.', custom('horse_one_cm'), 'distance'],
	['pig-jockey', 'Pig Jockey', 'Distance ridden on a pig.', custom('pig_one_cm'), 'distance'],
	[
		'lava-strider',
		'Lava Strider',
		'Distance ridden on a strider.',
		custom('strider_one_cm'),
		'distance'
	],
	[
		'cloud-rider',
		'Cloud Rider',
		'Distance flown on a happy ghast.',
		custom('happy_ghast_one_cm'),
		'distance'
	],
	[
		'shell-rider',
		'Shell Rider',
		'Distance ridden on a nautilus.',
		custom('nautilus_one_cm'),
		'distance'
	],
	['bunny-hopper', 'Bunny Hopper', 'Jumps.', custom('jump')],
	[
		'biome-collector',
		'Biome Collector',
		'Distinct biomes visited.',
		criteriaCount(mc('adventure/adventuring_time'))
	],
	['pearl-thrower', 'Pearl Thrower', 'Ender pearls thrown.', used('ender_pearl')],
	['rocketeer', 'Rocketeer', 'Firework rockets fired.', used('firework_rocket')],
	['unbroken', 'Unbroken', 'Time since last death.', custom('time_since_death'), 'duration']
]);

const farming = group('farming', [
	['matchmaker', 'Matchmaker', 'Animals bred.', custom('animals_bred')],
	['angler', 'Angler', 'Fish caught.', custom('fish_caught')],
	['wheat-harvester', 'Wheat Harvester', 'Wheat harvested.', mined('wheat')],
	[
		'root-cellar',
		'Root Cellar',
		'Carrots, potatoes and beetroot harvested.',
		mined('carrots', 'potatoes', 'beetroots')
	],
	['cane-cutter', 'Cane Cutter', 'Sugar cane cut.', mined('sugar_cane')],
	['patch-picker', 'Patch Picker', 'Pumpkins and melons picked.', mined('pumpkin', 'melon')],
	['wart-farmer', 'Wart Farmer', 'Nether wart harvested.', mined('nether_wart')],
	['cocoa-picker', 'Cocoa Picker', 'Cocoa pods picked.', mined('cocoa')],
	['berry-picker', 'Berry Picker', 'Sweet berry bushes harvested.', mined('sweet_berry_bush')],
	['kelp-cutter', 'Kelp Cutter', 'Kelp cut.', mined('kelp', 'kelp_plant')],
	['bamboo-chopper', 'Bamboo Chopper', 'Bamboo chopped.', mined('bamboo')],
	[
		'lumberjack',
		'Lumberjack',
		'Logs and stems chopped.',
		mined(...WOODS.map((w) => `${w}_log`), 'crimson_stem', 'warped_stem')
	],
	['pale-forester', 'Pale Forester', 'Pale oak logs chopped.', mined('pale_oak_log')],
	['green-thumb', 'Green Thumb', 'Bone meal used.', used('bone_meal')],
	[
		'seed-sower',
		'Seed Sower',
		'Seeds planted.',
		used(
			'wheat_seeds',
			'beetroot_seeds',
			'melon_seeds',
			'pumpkin_seeds',
			'torchflower_seeds',
			'pitcher_pod'
		)
	],
	['sheep-shearer', 'Sheep Shearer', 'Shears used.', used('shears')],
	[
		'butcher',
		'Butcher',
		'Cows, pigs, sheep and chickens slaughtered.',
		killed('cow', 'pig', 'sheep', 'chicken')
	],
	[
		'egg-collector',
		'Egg Collector',
		'Eggs collected, in every colour.',
		pickedUp('egg', 'blue_egg', 'brown_egg')
	],
	[
		'scute-collector',
		'Scute Collector',
		'Armadillo scutes collected.',
		pickedUp('armadillo_scute')
	],
	['hoe-graveyard', 'Hoe Down', 'Hoes worn out.', broken(...TOOL_TIERS.map((t) => `${t}_hoe`))],
	['axe-graveyard', 'Axe Grinder', 'Axes worn out.', broken(...TOOL_TIERS.map((t) => `${t}_axe`))]
]);

const crafting = group('crafting', [
	['automator', 'Automator', 'Crafters crafted.', crafted('crafter')],
	['enchanter', 'Enchanter', 'Items enchanted.', custom('enchant_item')],
	[
		'workbench-regular',
		'Workbench Regular',
		'Crafting tables opened.',
		custom('interact_with_crafting_table')
	],
	['anvil-smith', 'Anvil Smith', 'Anvils used.', custom('interact_with_anvil')],
	['smithy', 'Smithy', 'Smithing tables used.', custom('interact_with_smithing_table')],
	['disenchanter', 'Disenchanter', 'Grindstones used.', custom('interact_with_grindstone')],
	['brewer', 'Brewer', 'Brewing stands used.', custom('interact_with_brewingstand')],
	[
		'smelter',
		'Smelter',
		'Furnaces, blast furnaces and smokers used.',
		customSum(['interact_with_furnace', 'interact_with_blast_furnace', 'interact_with_smoker'])
	],
	['mason', 'Mason', 'Stonecutters used.', custom('interact_with_stonecutter')],
	['weaver', 'Weaver', 'Looms used.', custom('interact_with_loom')],
	[
		'cartographer',
		'Cartographer',
		'Cartography tables used.',
		custom('interact_with_cartography_table')
	],
	['trader', 'Trader', 'Trades made with villagers.', custom('traded_with_villager')],
	[
		'torchbearer',
		'Torchbearer',
		'Torches crafted.',
		crafted('torch', 'soul_torch', 'copper_torch')
	],
	[
		'baker',
		'Baker',
		'Bread, cake and cookies baked.',
		crafted('bread', 'cake', 'cookie', 'pumpkin_pie')
	],
	[
		'railwright',
		'Railwright',
		'Rails crafted.',
		crafted('rail', 'powered_rail', 'detector_rail', 'activator_rail')
	],
	['orchard-alchemist', 'Orchard Alchemist', 'Golden apples crafted.', crafted('golden_apple')],
	['beacon-builder', 'Beacon Builder', 'Beacons crafted.', crafted('beacon')],
	['electrician', 'Electrician', 'Copper bulbs crafted.', crafted('copper_bulb')],
	['pyrotechnician', 'Pyrotechnician', 'Firework rockets crafted.', crafted('firework_rocket')],
	['name-giver', 'Name Giver', 'Name tags crafted.', crafted('name_tag')],
	['librarian', 'Librarian', 'Bookshelves crafted.', crafted('bookshelf', 'chiseled_bookshelf')],
	[
		'tinkerer',
		'Tinkerer',
		'Pistons, observers and hoppers crafted.',
		crafted('piston', 'sticky_piston', 'observer', 'hopper')
	]
]);

const building = group('building', [
	[
		'bricklayer',
		'Bricklayer',
		'Bricks of every kind placed.',
		used(
			'bricks',
			'stone_bricks',
			'deepslate_bricks',
			'mud_bricks',
			'tuff_bricks',
			'resin_bricks',
			'nether_bricks'
		)
	],
	[
		'glazier',
		'Glazier',
		'Glass blocks and panes placed.',
		used('glass', 'glass_pane', 'tinted_glass', ...COLOURS.map((c) => `${c}_stained_glass`))
	],
	[
		'lamplighter',
		'Lamplighter',
		'Torches and lanterns placed.',
		used('torch', 'soul_torch', 'copper_torch', 'lantern', 'soul_lantern')
	],
	['scaffolder', 'Scaffolder', 'Scaffolding placed.', used('scaffolding')],
	[
		'track-layer',
		'Track Layer',
		'Rails laid.',
		used('rail', 'powered_rail', 'detector_rail', 'activator_rail')
	],
	[
		'carpenter',
		'Carpenter',
		'Planks placed.',
		used(...WOODS.map((w) => `${w}_planks`), 'bamboo_planks', 'crimson_planks', 'warped_planks')
	],
	[
		'concrete-jungle',
		'Concrete Jungle',
		'Concrete placed.',
		used(...COLOURS.map((c) => `${c}_concrete`))
	],
	[
		'terracotta-tiler',
		'Terracotta Tiler',
		'Terracotta placed.',
		used('terracotta', ...COLOURS.map((c) => `${c}_terracotta`))
	],
	['woolly-builder', 'Woolly Builder', 'Wool placed.', used(...COLOURS.map((c) => `${c}_wool`))],
	[
		'coppersmith',
		'Coppersmith',
		'Copper blocks placed.',
		used('copper_block', 'cut_copper', 'copper_grate', 'chiseled_copper')
	],
	[
		'redstone-engineer',
		'Redstone Engineer',
		'Redstone, repeaters and comparators placed.',
		used('redstone', 'repeater', 'comparator', 'piston', 'sticky_piston', 'observer')
	],
	[
		'decorator',
		'Decorator',
		'Item frames, paintings and armour stands placed.',
		used('item_frame', 'glow_item_frame', 'painting', 'armor_stand')
	],
	['florist', 'Florist', 'Plants potted.', custom('pot_flower')],
	[
		'bucket-brigade',
		'Bucket Brigade',
		'Buckets of water and lava poured.',
		used('water_bucket', 'lava_bucket')
	],
	[
		'quartz-architect',
		'Quartz Architect',
		'Quartz blocks placed.',
		used('quartz_block', 'quartz_bricks', 'quartz_pillar', 'smooth_quartz', 'chiseled_quartz_block')
	],
	[
		'cobble-stacker',
		'Cobble Stacker',
		'Cobblestone and cobbled deepslate placed.',
		used('cobblestone', 'cobbled_deepslate')
	]
]);

const misc = group('misc', [
	['dedicated', 'Dedicated', 'Time played this season.', custom('play_time'), 'duration'],
	['sleepyhead', 'Sleepyhead', 'Nights slept through.', custom('sleep_in_bed')],
	['chatterbox', 'Chatterbox', 'Conversations with villagers.', custom('talked_to_villager')],
	['chest-rummager', 'Chest Rummager', 'Chests opened.', custom('open_chest')],
	['ender-stasher', 'Ender Stasher', 'Ender chests opened.', custom('open_enderchest')],
	['shulker-packer', 'Shulker Packer', 'Shulker boxes opened.', custom('open_shulker_box')],
	['barrel-diver', 'Barrel Diver', 'Barrels opened.', custom('open_barrel')],
	['bell-ringer', 'Bell Ringer', 'Bells rung.', custom('bell_ring')],
	['musician', 'Musician', 'Note blocks played.', custom('play_noteblock')],
	['disc-jockey', 'Disc Jockey', 'Music discs played.', custom('play_record')],
	['cake-fiend', 'Cake Fiend', 'Slices of cake eaten.', custom('eat_cake_slice')],
	['litterbug', 'Litterbug', 'Items dropped.', custom('drop')],
	['coming-and-going', 'Coming and Going', 'Times logged out.', custom('leave_game')],
	['archaeologist', 'Archaeologist', 'Brush strokes on suspicious blocks.', used('brush')],
	[
		'vault-cracker',
		'Vault Cracker',
		'Vaults unlocked with trial keys.',
		used('trial_key', 'ominous_trial_key')
	],
	['ominous-sipper', 'Ominous Sipper', 'Ominous bottles drunk.', used('ominous_bottle')],
	['raid-starter', 'Raid Starter', 'Raids triggered.', custom('raid_trigger')],
	['second-chance', 'Second Chance', 'Totems of undying used up.', used('totem_of_undying')],
	[
		'golden-gobbler',
		'Golden Gobbler',
		'Golden apples eaten.',
		used('golden_apple', 'enchanted_golden_apple')
	],
	['lookout', 'Lookout', 'Spyglass uses.', used('spyglass')],
	['horn-blower', 'Horn Blower', 'Goat horns sounded.', used('goat_horn')],
	[
		'spring-cleaner',
		'Spring Cleaner',
		'Armour, banners and shulker boxes washed in a cauldron.',
		customSum(['clean_armor', 'clean_banner', 'clean_shulker_box'])
	],
	['nicknamer', 'Nicknamer', 'Name tags used.', used('name_tag')],
	['wrangler', 'Wrangler', 'Leads used.', used('lead')],
	['tnt-enthusiast', 'Demolitionist', 'TNT placed.', used('tnt')],
	['night-owl', 'Night Owl', 'Time since last slept.', custom('time_since_rest'), 'duration']
]);

export const awards: Award[] = [
	...mining,
	...combat,
	...travel,
	...farming,
	...crafting,
	...building,
	...misc
];
