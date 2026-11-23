<script lang="ts">
	import '$lib/styles/stats.css';
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import LookSwitcher from '$lib/components/stats/LookSwitcher.svelte';
	import PixelSprite from '$lib/components/stats/PixelSprite.svelte';
	import StatsNav from '$lib/components/stats/StatsNav.svelte';
	import { formatDate } from '$lib/stats/format';
	import { DEFAULT_LOOK, LOOK_STORAGE_KEY, isLook, type LookId } from '$lib/stats/look';
	import { logoSprite } from '$lib/stats/sprites';

	let { data, children } = $props();

	let look = $state<LookId>(DEFAULT_LOOK);
	let showSwitcher = $state(dev);

	// Client-only: the pages are prerendered, so the look is picked after hydration.
	$effect(() => {
		const fromUrl = page.url.searchParams.get('look');
		if (isLook(fromUrl)) {
			look = fromUrl;
			showSwitcher = true;
			sessionStorage.setItem(LOOK_STORAGE_KEY, fromUrl);
			return;
		}
		const stored = sessionStorage.getItem(LOOK_STORAGE_KEY);
		if (isLook(stored)) {
			look = stored;
			showSwitcher = true;
		}
	});
</script>

<svelte:head>
	{#if look !== 'classic'}
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" />
	{/if}
</svelte:head>

<div class={['stats-theme', `stats-theme--${look}`]}>
	{#if data.meta}
		<header class="stats-header">
			<StatsNav />
			<aside class="stats-info" aria-label="Season">
				<PixelSprite sprite={logoSprite} class="stats-info__icon" />
				<p class="stats-info__name">NearVanilla SMP · {data.meta.season}</p>
				<p class="mc-muted">
					Last update <span class="mc-info">{formatDate(data.meta.updatedAt)}</span>
				</p>
				{#if data.meta.sample}
					<p class="stats-info__notice" role="note">
						Sample data: <code>STATS_DIR</code> isn't set
					</p>
				{/if}
			</aside>
		</header>

		{@render children()}
	{:else}
		<section class="stats-view stats-view--narrow stats-empty">
			<header class="stats-view__header">
				<h1 class="stats-view__title">
					<span class="stats-view__title-text">Leaderboards</span>
				</h1>
				<p class="stats-view__desc">
					Leaderboards aren't available yet. Check back once the season's stats have been collected.
				</p>
			</header>
		</section>
	{/if}

	<footer class="stats-footer">
		<p>
			Leaderboards inspired by
			<a class="mc-link" href="https://github.com/pdinklag/MinecraftStats">MinecraftStats</a>
			by pdinklag; background textures and some award icons come from it (<a
				class="mc-link"
				href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a
			>).
		</p>
		<p>
			Minecraft textures and item icons © Mojang AB / Microsoft. Medal and crown icons by
			<a class="mc-link" href="https://www.fatcow.com/free-icons">FatCow</a>
			(<a class="mc-link" href="https://creativecommons.org/licenses/by/3.0/us/">CC BY 3.0</a>).
			Font based on
			<a class="mc-link" href="https://github.com/IdreesInc/Monocraft">Monocraft</a>
			by Idrees Hassan (<a class="mc-link" href="https://openfontlicense.org">OFL</a>).
		</p>
		<p class="stats-footer__disclaimer">
			NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
		</p>
	</footer>

	{#if showSwitcher}
		<LookSwitcher current={look} />
	{/if}
</div>

<style>
	/* Nav box on the left, season box on the right, both sitting on the grass strip. */
	.stats-header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-start;
		gap: calc(var(--px) * 4);
		min-height: 64px;
		padding: calc(var(--px) * 9) calc(var(--px) * 3) 0;
	}

	/* As on the original, the header is one grass strip tall and its boxes overhang the dirt. */
	@media (min-width: 768px) {
		.stats-theme--classic .stats-header {
			position: relative;
			z-index: 1;
			height: 64px;
		}
	}

	.stats-info {
		display: grid;
		grid-template-columns: auto auto;
		column-gap: calc(var(--px) * 3);
		align-items: center;
		margin-left: auto;
		padding: calc(var(--px) * 3);
		background-color: var(--stats-box-strong);
		border-radius: var(--stats-box-radius);
		clip-path: var(--stats-corners);
		text-align: right;
	}

	.stats-info > :global(.stats-info__icon) {
		grid-row: 1 / span 3;
		align-self: start;
	}

	.stats-info__name {
		color: var(--stats-text-strong);
		text-shadow: var(--stats-shadow);
	}

	.stats-info__notice {
		color: #ffff55;
	}

	.stats-info__notice code {
		font-family: inherit;
	}

	.stats-empty {
		padding-top: calc(var(--px) * 16);
	}

	.stats-footer {
		margin-top: auto;
		padding: calc(var(--px) * 4) calc(var(--px) * 6);
		background: var(--stats-floor);
		text-align: center;
		color: var(--stats-text-muted);
		text-shadow: var(--stats-shadow);
	}

	.stats-footer__disclaimer {
		margin-top: calc(var(--px) * 2);
		color: var(--stats-text);
	}

	/* The earlier explorations keep their own header bands. */
	.stats-theme--slate .stats-header {
		background:
			url('$lib/assets/stats/textures/copper-trim.svg') 0 100% / 32px 8px repeat-x,
			url('$lib/assets/stats/textures/copper-plate.svg') 0 0 / 64px 64px;
		padding-bottom: calc(var(--px) * 12);
		margin-bottom: calc(var(--px) * 4);
	}

	.stats-theme--brand .stats-header {
		background:
			url('$lib/assets/stats/textures/brand-stripe.svg') 0 100% / 32px 8px repeat-x,
			url('$lib/assets/stats/textures/brand-sky.svg') 0 0 / 32px 192px repeat-x,
			#0d0d0d;
		padding-bottom: calc(var(--px) * 12);
		margin-bottom: calc(var(--px) * 4);
	}

	.stats-theme--quiet .stats-header {
		background:
			url('$lib/assets/stats/textures/quiet-fade.svg') 0 100% / 32px 16px repeat-x,
			#1a1a1a;
		padding-bottom: calc(var(--px) * 14);
	}

	.stats-theme--quiet .stats-info,
	.stats-theme--quiet .stats-header :global(.stats-nav) {
		background-color: transparent;
	}
</style>
