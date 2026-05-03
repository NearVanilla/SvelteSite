<script lang="ts">
	import DownloadCard from '$lib/components/DownloadCard.svelte';

	import season1Img from '$lib/assets/screenshots/world_downloads/s1.webp';
	import season2Img from '$lib/assets/screenshots/world_downloads/s2.webp';
	import season3Img from '$lib/assets/screenshots/world_downloads/s3.webp';
	import season4Img from '$lib/assets/screenshots/world_downloads/s4.webp';
	import season5Img from '$lib/assets/screenshots/world_downloads/s5.webp';
	import season6Img from '$lib/assets/screenshots/world_downloads/s6.webp';
	import season6CreativeImg from '$lib/assets/screenshots/world_downloads/s6_c.webp';

	interface WorldDownload {
		name: string;
		versionRange: string;
		fileSize: string;
		downloadHref: string;
		seasonDates: string;
		imageSrc: string;
	}

	const worlds: WorldDownload[] = [
		{
			name: 'Season 1',
			versionRange: '1.12',
			fileSize: '2.3 GB',
			downloadHref: 'https://files.nearvanilla.com/worlds/NearVanillaS1.zip',
			seasonDates: '6th June 2017 - 3rd June 2018',
			imageSrc: season1Img
		},
		{
			name: 'Season 2',
			versionRange: '1.13',
			fileSize: '4.8 GB',
			downloadHref: 'https://files.nearvanilla.com/worlds/NearVanillaS2.zip',
			seasonDates: '28th June 2018 - 23rd July 2018',
			imageSrc: season2Img
		},
		{
			name: 'Season 3',
			versionRange: '1.13.2',
			fileSize: '7.4 GB',
			downloadHref: 'https://files.nearvanilla.com/worlds/NearVanillaS3.zip',
			seasonDates: '28th October 2018 - 25th May 2019',
			imageSrc: season3Img
		},
		{
			name: 'Season 4',
			versionRange: '1.15.2',
			fileSize: '9.7 GB',
			downloadHref: 'https://files.nearvanilla.com/worlds/NearVanillaS4.zip',
			seasonDates: '1st June 2019 - 3rd July 2020',
			imageSrc: season4Img
		},
		{
			name: 'Season 5',
			versionRange: '1.17.1',
			fileSize: '18.4 GB',
			downloadHref: 'https://files.nearvanilla.com/worlds/NearVanillaS5.zip',
			seasonDates: '4th July 2020 - 3rd January 2022',
			imageSrc: season5Img
		},
		{
			name: 'Season 6',
			versionRange: '1.20.6',
			fileSize: '45.1 GB',
			downloadHref: 'https://files.nearvanilla.com/worlds/NearVanillaS6.7z',
			seasonDates: '8th January 2022 - 22nd July 2024',
			imageSrc: season6Img
		},
		{
			name: 'Season 6 (Creative)',
			versionRange: '1.20.6',
			fileSize: '1 GB',
			downloadHref: 'https://files.nearvanilla.com/worlds/NearVanillaS6Creative.7z',
			seasonDates: '8th January 2022 - 22nd July 2024',
			imageSrc: season6CreativeImg
		}
	];
</script>

<svelte:head>
	<title>World Downloads — NearVanilla</title>
	<meta
		name="description"
		content="Download previous NearVanilla world saves. Each world archive includes the full map from its active season."
	/>
	<link rel="canonical" href="https://nearvanilla.com/downloads" />
</svelte:head>

<section class="downloads-hero">
	<div class="downloads-hero__inner">
		<p class="downloads-hero__eyebrow">Archive</p>
		<h1 class="downloads-hero__title">
			World <span class="downloads-hero__title-accent">Downloads</span>
		</h1>
		<p class="downloads-hero__desc">
			Every previous NearVanilla world is preserved and made available to the community. Download
			any season's world save and explore it in single-player or on your own server.
		</p>
	</div>
</section>

<section class="downloads-section">
	<div class="downloads-section__inner">
		<ul class="downloads-grid" role="list">
			{#each worlds as world (world.name)}
				<li>
					<DownloadCard
						name={world.name}
						versionRange={world.versionRange}
						fileSize={world.fileSize}
						downloadHref={world.downloadHref}
						seasonDates={world.seasonDates}
						imageSrc={world.imageSrc}
					/>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.downloads-hero {
		background-color: var(--color-surface-alt);
		border-bottom: 1px solid var(--color-border);
		padding: clamp(2.5rem, 5vw, 4rem) 1.5rem;
	}

	.downloads-hero__inner {
		max-width: 1100px;
		margin: 0 auto;
		text-align: center;
	}

	.downloads-hero__eyebrow {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.8rem;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--color-accent);
		margin-bottom: 0.75rem;
	}

	.downloads-hero__title {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(2rem, 5vw, 3.5rem);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-brand-lime);
		margin-bottom: 1.25rem;
	}

	.downloads-hero__title-accent {
		color: var(--color-brand-sky);
	}

	.downloads-hero__desc {
		font-size: clamp(0.875rem, 1.5vw, 1rem);
		color: var(--color-text-muted);
		max-width: 560px;
		margin: 0 auto;
		line-height: 1.7;
	}

	.downloads-section {
		padding: clamp(2.5rem, 5vw, 5rem) 1.5rem;
	}

	.downloads-section__inner {
		max-width: 1100px;
		margin: 0 auto;
	}

	.downloads-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.25rem;
		list-style: none;
	}

	@media (max-width: 480px) {
		.downloads-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
