<script lang="ts">
	import CategoryGlyph from '$lib/components/stats/CategoryGlyph.svelte';
	import Medal from '$lib/components/stats/Medal.svelte';
	import PlayerAvatar from '$lib/components/stats/PlayerAvatar.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>NearVanilla SMP - {data.award.name}</title>
	<meta name="description" content="{data.award.name}: {data.award.description}" />
	<link rel="canonical" href="https://nearvanilla.com/stats/awards/{data.award.id}" />
</svelte:head>

<article class="stats-page stats-page--narrow">
	<header class="stats-page__header">
		<p class="award-category">
			<CategoryGlyph category={data.award.category} />
			{data.award.label}
		</p>
		<h1 class="stats-page__title">{data.award.name}</h1>
		<p class="stats-page__desc">{data.award.description}</p>
	</header>

	<section class="stats-table-wrap">
		<table class="stats-table">
			<caption>Ranking · {data.rows.length} players</caption>
			<thead>
				<tr>
					<th scope="col" class="stats-table__rank">Rank</th>
					<th scope="col">Player</th>
					<th scope="col" class="stats-table__num">Value</th>
				</tr>
			</thead>
			<tbody>
				{#each data.rows as row (row.uuid)}
					<tr>
						<td class="stats-table__rank">
							<span class="stats-rank">
								{row.rank}
								{#if row.medal}<Medal medal={row.medal} />{/if}
							</span>
						</td>
						<td>
							<a class="stats-player" href="/stats/players/{row.slug}">
								<PlayerAvatar uuid={row.uuid} size={28} />
								<span class="stats-player__name">{row.name}</span>
							</a>
						</td>
						<td class="stats-table__num">{row.value}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<a class="stats-page__back" href="/stats">← All awards</a>
</article>

<style>
	.award-category {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 0.75rem;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.85rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}
</style>
