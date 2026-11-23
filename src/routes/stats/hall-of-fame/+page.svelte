<script lang="ts">
	import Medal from '$lib/components/stats/Medal.svelte';
	import PlayerAvatar from '$lib/components/stats/PlayerAvatar.svelte';
	import RankBadge from '$lib/components/stats/RankBadge.svelte';

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

<article class="stats-view stats-view--narrow">
	<header class="stats-view__header">
		<h1 class="stats-view__title"><span class="stats-view__title-text">Hall of Fame</span></h1>
		<p class="stats-view__subtitle">Players ranked by the medals they hold right now</p>
		<p class="stats-view__desc">
			A gold medal is worth {data.points.gold} points, silver {data.points.silver} and bronze
			{data.points.bronze}.
		</p>
	</header>

	<section class="mc-entry" aria-label="{data.rows.length} medal holders">
		<div class="mc-box mc-table-scroll">
			<table class="mc-table">
				<thead>
					<tr>
						<th scope="col" class="mc-table__end">Rank</th>
						<th scope="col">Player</th>
						<th scope="col" class="mc-table__center"><Medal medal="gold" /></th>
						<th scope="col" class="mc-table__center"><Medal medal="silver" /></th>
						<th scope="col" class="mc-table__center"><Medal medal="bronze" /></th>
						<th scope="col" class="mc-table__end">Score</th>
					</tr>
				</thead>
				<tbody>
					{#each data.rows as row (row.uuid)}
						<tr>
							<td class="mc-table__end"><RankBadge rank={row.rank} kind="crown" /></td>
							<td>
								<a class="mc-player mc-link" href="/stats/players/{row.slug}">
									<PlayerAvatar uuid={row.uuid} size={32} />
									{row.name}
								</a>
							</td>
							<td class="mc-table__center mc-data">{row.gold}</td>
							<td class="mc-table__center mc-data">{row.silver}</td>
							<td class="mc-table__center mc-data">{row.bronze}</td>
							<td class="mc-table__end mc-data">{row.points}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</article>
