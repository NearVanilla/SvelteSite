<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import InfoSection from '$lib/components/InfoSection.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import PluginsSection from '$lib/components/PluginsSection.svelte';
	import SpecsSection from '$lib/components/SpecsSection.svelte';
	import spawnImg from '$lib/assets/screenshots/spawn.webp';
</script>

<main>
	<Hero />
	<InfoSection
		heading="What is"
		headingAccent="Near Vanilla?"
		body="NearVanilla is a semi-vanilla Minecraft survival server focused on keeping gameplay close
			to the original experience while fostering a friendly and welcoming community. We believe
			the best Minecraft adventures happen when the game stays true to its roots — no pay-to-win,
			no game-breaking mods, just you, the world, and the people you meet along the way. Join
			hundreds of players building, exploring, and surviving together in a fair and fun
			environment."
		image={spawnImg}
		imageAlt="NearVanilla spawn area"
	/>
	<InfoSection
		heading="The"
		headingAccent="Community"
		body="Our community is at the heart of everything we do. With active forums, a lively Discord
			server, and regular in-game events, there's always something happening on NearVanilla. Get
			to know your fellow players and become part of something bigger than just a game."
		alt
	/>
	<Gallery />
	<PluginsSection />
	<SpecsSection />
</main>
