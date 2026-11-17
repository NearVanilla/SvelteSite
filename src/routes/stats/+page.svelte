<script lang="ts">
	import CategoryGlyph from '$lib/components/stats/CategoryGlyph.svelte';
	import Medal from '$lib/components/stats/Medal.svelte';
	import PlayerAvatar from '$lib/components/stats/PlayerAvatar.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>NearVanilla SMP - Leaderboards</title>
	<meta
		name="description"
		content="Season leaderboards for NearVanilla SMP: who has mined, fought, travelled and built the most."
	/>
	<link rel="canonical" href="https://nearvanilla.com/stats" />
</svelte:head>

<article class="stats-page">
	<header class="stats-page__header">
		<h1 class="stats-page__title">Awards</h1>
		<p class="stats-page__desc">
			Every award's current top three. Only players seen in the last {data.inactiveDays} days are ranked.
		</p>
	</header>

	{#each data.categories as group (group.category)}
		<section class="award-group" aria-labelledby="category-{group.category}">
			<h2 class="award-group__title" id="category-{group.category}">
				<CategoryGlyph category={group.category} />
				{group.label}
			</h2>
			<ul class="award-group__grid">
				{#each group.awards as award (award.id)}
					<li>
						<article class="award-card">
							<h3 class="award-card__name">
								<a class="award-card__link" href="/stats/awards/{award.id}">{award.name}</a>
							</h3>
							<p class="award-card__desc">{award.description}</p>
							<ol class="award-card__top">
								{#each award.top as row (row.uuid)}
									<li class="award-card__entry">
										{#if row.medal}<Medal medal={row.medal} />{/if}
										<PlayerAvatar uuid={row.uuid} size={24} />
										<a class="award-card__player" href="/stats/players/{row.slug}">{row.name}</a>
										<span class="award-card__value">{row.value}</span>
									</li>
								{/each}
							</ol>
						</article>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</article>

<style>
	.stats-page {
		max-width: 1100px;
		margin: 0 auto;
		padding: clamp(2rem, 4vw, 3rem) 1.5rem clamp(3rem, 6vw, 5rem);
	}

	.stats-page__header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.stats-page__title {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(2rem, 5vw, 3rem);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-brand-lime);
		margin-bottom: 0.75rem;
	}

	.stats-page__desc {
		color: var(--color-text-muted);
	}

	.award-group {
		margin-bottom: 3rem;
	}

	.award-group__title {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.5rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-bottom: 1.25rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.award-group__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
		gap: 1rem;
		list-style: none;
	}

	.award-card {
		height: 100%;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		padding: 1.1rem 1.2rem;
		transition: border-color 0.2s ease;
	}

	.award-card:hover,
	.award-card:focus-within {
		border-color: var(--color-accent);
	}

	.award-card__name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.2rem;
		letter-spacing: 0.04em;
		margin-bottom: 0.2rem;
	}

	.award-card__link {
		color: var(--color-text);
		text-decoration: none;
	}

	.award-card__link:hover,
	.award-card__link:focus-visible {
		color: var(--color-brand-sky);
	}

	.award-card__desc {
		font-size: 0.85rem;
		color: var(--color-text-muted);
		margin-bottom: 0.9rem;
	}

	.award-card__top {
		display: grid;
		gap: 0.45rem;
		list-style: none;
	}

	.award-card__entry {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
	}

	.award-card__player {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--color-text);
		text-decoration: none;
	}

	.award-card__player:hover,
	.award-card__player:focus-visible {
		color: var(--color-brand-sky);
		text-decoration: underline;
	}

	.award-card__value {
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted);
	}
</style>
