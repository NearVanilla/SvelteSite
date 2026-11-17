<script lang="ts">
	import StatsNav from '$lib/components/stats/StatsNav.svelte';
	import { formatDate } from '$lib/stats/format';

	let { data, children } = $props();
</script>

{#if data.meta}
	<header class="stats-header">
		<p class="stats-header__eyebrow">Leaderboards</p>
		<p class="stats-header__meta">
			{data.meta.season} · Updated {formatDate(data.meta.updatedAt)} · {data.meta.activeCount}
			active players
		</p>
		{#if data.meta.sample}
			<p class="stats-header__notice" role="note">
				Sample data: <code>STATS_DIR</code> isn't set, so these are made-up players.
			</p>
		{/if}
		<StatsNav />
	</header>

	{@render children()}
{:else}
	<section class="stats-empty">
		<p class="stats-header__eyebrow">Leaderboards</p>
		<h1 class="stats-empty__title">Coming soon</h1>
		<p class="stats-empty__desc">
			Leaderboards aren't available yet. Check back once the season's stats have been collected.
		</p>
	</section>
{/if}

<style>
	.stats-header,
	.stats-empty {
		background-color: var(--color-surface-alt);
		border-bottom: 1px solid var(--color-border);
		padding: 1.75rem 1.5rem 1.5rem;
		text-align: center;
	}

	.stats-header__eyebrow {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.8rem;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--color-accent);
		margin-bottom: 0.4rem;
	}

	.stats-header__meta {
		font-size: 0.9rem;
		color: var(--color-text-muted);
		margin-bottom: 1.1rem;
	}

	.stats-header__notice {
		display: inline-block;
		margin-bottom: 1.1rem;
		padding: 0.4rem 0.9rem;
		border: 1px dashed var(--color-brand-lime);
		border-radius: 4px;
		font-size: 0.85rem;
		color: var(--color-brand-lime);
	}

	.stats-empty {
		padding-block: clamp(3rem, 8vw, 6rem);
	}

	.stats-empty__title {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(2rem, 5vw, 3.5rem);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-brand-lime);
		margin-bottom: 1rem;
	}

	.stats-empty__desc {
		color: var(--color-text-muted);
		max-width: 480px;
		margin: 0 auto;
	}
</style>
