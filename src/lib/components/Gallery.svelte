<script lang="ts">
	import { onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { prefersReducedMotion } from 'svelte/motion';
	import { getMeta, type ScreenshotMeta } from '$lib/data/gallery';

	interface GalleryImage {
		src: string;
		alt: string;
		meta: ScreenshotMeta | undefined;
	}

	// Picks up every .webp dropped into the community folder at build time.
	// Add or remove files there — no code change needed.
	const modules = import.meta.glob('../assets/screenshots/community/*.webp', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as Record<string, string>;

	const images: GalleryImage[] = Object.entries(modules)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([path, src]) => {
			const filename = path.split('/').pop()?.replace('.webp', '') ?? '';
			const meta = getMeta(filename);
			return { src, alt: meta?.alt ?? 'Minecraft community build on NearVanilla', meta };
		});

	const tilesNeeded = images.length ? Math.max(1, Math.ceil(12 / images.length)) : 0;
	const group = Array.from({ length: tilesNeeded }, () => images).flat();
	const noHover = new MediaQuery('(hover: none)', true);
	let mounted = $state(false);
	const motionAllowed = $derived(mounted && !noHover.current && !prefersReducedMotion.current);

	onMount(() => {
		mounted = true;
	});
</script>

{#snippet imageItem(image: GalleryImage)}
	<figure class="gallery__item">
		<img src={image.src} alt={image.alt} class="gallery__img" loading="lazy" decoding="async" />
		{#if image.meta?.buildName || image.meta?.builders?.length}
			<figcaption class="gallery__caption">
				{#if image.meta.buildName}
					<p class="gallery__caption-build">{image.meta.buildName}</p>
				{/if}
				{#if image.meta.builders?.length}
					<ul class="gallery__caption-builders">
						{#each image.meta.builders as builder (builder.name)}
							<li>
								{#if builder.flag}
									<span class="gallery__flag" aria-hidden="true">{builder.flag}</span>
								{/if}
								{builder.name}
							</li>
						{/each}
					</ul>
				{/if}
			</figcaption>
		{/if}
	</figure>
{/snippet}

{#snippet marquee(reverse: boolean)}
	<div class="gallery__viewport" aria-hidden="true">
		<div class="gallery__track" class:gallery__track--reverse={reverse}>
			{#each [0, 1] as copy (copy)}
				<div class="gallery__group">
					{#each group as image, index (index)}
						{@render imageItem(image)}
					{/each}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#if images.length}
	<section class="gallery" aria-label="Server screenshot gallery">
		{#if !motionAllowed}
			<div class="gallery__grid">
				{#each images as image (image.src)}
					{@render imageItem(image)}
				{/each}
			</div>
		{:else}
			{@render marquee(false)}
			{@render marquee(true)}
		{/if}
	</section>
{/if}

<style>
	.gallery {
		background-color: var(--color-surface-alt);
		padding: 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.gallery__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
		gap: 1rem;
		padding: 0 1.5rem;
	}

	.gallery__grid .gallery__img {
		width: 100%;
	}

	.gallery__grid .gallery__caption {
		position: static;
		opacity: 1;
		padding: 0.625rem;
		background: var(--color-surface);
	}

	.gallery__viewport {
		position: relative;
		width: 100%;
		/* overflow-x: clip keeps the wide track hidden without forcing overflow-y to auto.
		   overflow-y: visible lets the scale(1.04) hover effect show without being clipped. */
		overflow-x: clip;
		overflow-y: visible;
	}

	.gallery__viewport::before,
	.gallery__viewport::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		width: clamp(48px, 10vw, 120px);
		z-index: 2;
		pointer-events: none;
	}

	.gallery__viewport::before {
		left: 0;
		background: linear-gradient(to right, var(--color-surface-alt), transparent);
	}

	.gallery__viewport::after {
		right: 0;
		background: linear-gradient(to left, var(--color-surface-alt), transparent);
	}

	.gallery__track {
		display: flex;
		width: max-content;
		animation: gallery-scroll 50s linear infinite;
	}

	.gallery__group {
		display: flex;
		flex-shrink: 0;
		gap: 6px;
		padding-right: 6px;
	}

	.gallery__track--reverse {
		animation-direction: reverse;
	}

	.gallery__viewport:hover .gallery__track {
		animation-play-state: paused;
	}

	.gallery__img {
		width: clamp(200px, 22vw, 340px);
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 4px;
		display: block;
	}

	.gallery__item {
		flex-shrink: 0;
		margin: 0;
		position: relative;
		border-radius: 4px;
	}

	.gallery__viewport .gallery__item {
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease;
	}

	.gallery__viewport .gallery__item:hover {
		transform: scale(1.04);
		box-shadow:
			0 0 0 2px var(--color-accent),
			0 8px 32px rgba(0, 0, 0, 0.6);
		z-index: 3;
	}

	.gallery__caption {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		border-radius: 0 0 4px 4px;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 100%);
		padding: 2rem 0.625rem 0.5rem;
		opacity: 0;
		transition: opacity 0.2s ease;
		pointer-events: none;
		z-index: 4;
	}

	.gallery__item:hover .gallery__caption {
		opacity: 1;
	}

	.gallery__caption-build {
		margin: 0 0 0.25rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: #fff;
		overflow-wrap: anywhere;
	}

	.gallery__caption-builders {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.gallery__caption-builders li {
		font-size: 0.7rem;
		color: var(--color-text);
		overflow-wrap: anywhere;
	}

	.gallery__flag {
		font-size: 0.85rem;
	}

	@keyframes gallery-scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.gallery__item,
		.gallery__caption {
			transition: none;
		}
	}

	@media (max-width: 768px) {
		.gallery__img {
			width: clamp(150px, 38vw, 220px);
		}
	}
</style>
