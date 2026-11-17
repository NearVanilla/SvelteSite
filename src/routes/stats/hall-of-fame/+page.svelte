<script lang="ts">
	import Medal from '$lib/components/stats/Medal.svelte';
	import PlayerAvatar from '$lib/components/stats/PlayerAvatar.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>NearVanilla SMP - Hall of Fame</title>
	<meta
		name="description"
		content="NearVanilla SMP players ranked by the medals they hold across every award this season."
	/>
	<link rel="canonical" href="https://nearvanilla.com/stats/hall-of-fame" />
</svelte:head>

<article class="stats-page stats-page--narrow">
	<header class="stats-page__header">
		<h1 class="stats-page__title">Hall of Fame</h1>
		<p class="stats-page__desc">
			Players ranked by the medals they hold right now: Gold {data.points.gold} · Silver
			{data.points.silver} · Bronze {data.points.bronze} points.
		</p>
	</header>

	<section class="stats-table-wrap">
		<table class="stats-table">
			<caption>{data.rows.length} medal holders</caption>
			<thead>
				<tr>
					<th scope="col" class="stats-table__rank">Rank</th>
					<th scope="col">Player</th>
					<th scope="col" class="stats-table__num"><Medal medal="gold" /></th>
					<th scope="col" class="stats-table__num"><Medal medal="silver" /></th>
					<th scope="col" class="stats-table__num"><Medal medal="bronze" /></th>
					<th scope="col" class="stats-table__num">Points</th>
				</tr>
			</thead>
			<tbody>
				{#each data.rows as row (row.uuid)}
					<tr>
						<td class="stats-table__rank">{row.rank}</td>
						<td>
							<a class="stats-player" href="/stats/players/{row.slug}">
								<PlayerAvatar uuid={row.uuid} size={28} />
								<span class="stats-player__name">{row.name}</span>
							</a>
						</td>
						<td class="stats-table__num">{row.gold}</td>
						<td class="stats-table__num">{row.silver}</td>
						<td class="stats-table__num">{row.bronze}</td>
						<td class="stats-table__num hall-points">{row.points}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</article>

<style>
	.hall-points {
		font-weight: 700;
		color: var(--color-brand-lime);
	}
</style>
