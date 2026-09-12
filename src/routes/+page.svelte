<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import InfoSection from '$lib/components/InfoSection.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import PluginsSection from '$lib/components/PluginsSection.svelte';
	import SpecsSection from '$lib/components/SpecsSection.svelte';
	import aboutImg from '$lib/assets/screenshots/about.webp';
	import communityImg from '$lib/assets/screenshots/community.webp';
</script>

<svelte:head>
	<title>NearVanilla — Semi-Vanilla Minecraft Survival Server</title>
	<meta
		name="description"
		content="Join NearVanilla, a semi-vanilla Minecraft survival server designed to stay close to the original experience while providing a welcoming community. Explore, build, and connect."
	/>
	<meta property="og:title" content="NearVanilla — Semi-Vanilla Minecraft Server" />
	<meta
		property="og:description"
		content="A community-focused Minecraft survival server that puts the vanilla experience first."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="NearVanilla — Semi-Vanilla Minecraft Server" />
	<meta
		name="twitter:description"
		content="A community-focused Minecraft survival server that puts the vanilla experience first."
	/>
	<link rel="canonical" href="https://nearvanilla.com/" />
</svelte:head>

<Hero />
<InfoSection
	id="about"
	heading="What is"
	headingAccent="Near Vanilla?"
	body="NearVanilla is a semi-vanilla Minecraft survival server designed to stay as close to the
		original experience as possible while still supporting a welcoming and active community.
		Our goal is to maintain the spirit of vanilla Minecraft while providing the stability,
		moderation and community that make long-term survival servers great. Players are free to
		create, collaborate and shape the world around them naturally. Whether you're building
		something ambitious, exploring the wilderness or simply enjoying the game at your own pace,
		NearVanilla is a place where players collaborate, build together and shape the world as a
		community."
	image={aboutImg}
	imageAlt="NearVanilla spawn area"
/>
<InfoSection
	heading="The"
	headingAccent="Community"
	body="NearVanilla thrives because of its community. Players regularly come together to share ideas and
		resources, collaborate on builds, create projects and host events together. With an active Discord,
		community discussions, and our thriving ecosystem of plugins and tools, there are always opportunities
		to connect, contribute, and build lasting friendships. Whether you're a solo adventurer or a group
		player, you'll find a welcoming atmosphere and a space where everyone's input is valued."
	image={communityImg}
	imageAlt="NearVanilla community"
	alternateBackground
/>
<Gallery />
<PluginsSection />
<SpecsSection />
