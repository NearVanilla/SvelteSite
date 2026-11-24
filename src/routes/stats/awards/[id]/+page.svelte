<script lang="ts">
	import AwardIcon from '$lib/components/stats/AwardIcon.svelte';
	import PlayerAvatar from '$lib/components/stats/PlayerAvatar.svelte';
	import RankBadge from '$lib/components/stats/RankBadge.svelte';
	import { statLabel } from '$lib/stats/format';

	let { data } = $props();
</script>

<svelte:head>
	<title>NearVanilla SMP - {data.award.name}</title>
	<meta name="description" content="{data.award.name}: {data.award.description}" />
	<link rel="canonical" href="https://nearvanilla.com/stats/awards/{data.award.id}" />
</svelte:head>

<article class="stats-view stats-view--narrow">
	<header class="stats-view__header">
		<h1 class="stats-view__title">
			<AwardIcon id={data.award.id} />
			<span class="stats-view__title-text">{data.award.name}</span>
		</h1>
		<p class="stats-view__subtitle">{data.award.label} award ranking</p>
		<p class="stats-view__desc">{data.award.description}</p>
	</header>

	<section class="mc-entry" aria-label="Ranking">
		<div class="mc-box mc-table-scroll">
			<table class="mc-table">
				<thead>
					<tr>
						<th scope="col" class="mc-table__end">Rank</th>
						<th scope="col">Player</th>
						<th scope="col" class="mc-table__end">{statLabel(data.award.description)}</th>
					</tr>
				</thead>
				<tbody>
					{#each data.rows as row (row.uuid)}
						<tr>
							<td class="mc-table__end"><RankBadge rank={row.rank} /></td>
							<td>
								<a class="mc-player mc-link" href="/stats/players/{row.slug}">
									<PlayerAvatar uuid={row.uuid} size={32} />
									{row.name}
								</a>
							</td>
							<td class="mc-table__end mc-data">{row.value}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</article>
