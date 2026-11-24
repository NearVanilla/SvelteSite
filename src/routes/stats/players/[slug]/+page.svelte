<script lang="ts">
	import AwardIcon from '$lib/components/stats/AwardIcon.svelte';
	import Medal from '$lib/components/stats/Medal.svelte';
	import PlayerAvatar from '$lib/components/stats/PlayerAvatar.svelte';
	import RankBadge from '$lib/components/stats/RankBadge.svelte';
	import { statLabel } from '$lib/stats/format';

	let { data } = $props();
	const player = $derived(data.player);

	/** Every award the player has a value for, alphabetically, as on the award list. */
	const rows = $derived(
		data.categories.flatMap((group) => group.rows).sort((a, b) => a.name.localeCompare(b.name))
	);
</script>

<svelte:head>
	<title>NearVanilla SMP - {player.name}</title>
	<meta name="description" content="{player.name}'s awards and medals on NearVanilla SMP." />
	<link rel="canonical" href="https://nearvanilla.com/stats/players/{player.slug}" />
</svelte:head>

<article class="stats-view stats-view--narrow">
	<header class="stats-view__header">
		<h1 class="stats-view__title">
			<PlayerAvatar uuid={player.uuid} size={32} />
			<span class="stats-view__title-text">{player.name}</span>
		</h1>
		<p class="stats-view__subtitle">Player statistics</p>
		<p class="stats-view__desc">
			Last played:
			<span class={player.active ? 'mc-success' : 'mc-danger'}>{player.lastSeen}</span>
			· Playtime: <span class="mc-data">{player.playtime}</span>
		</p>
		<p class="stats-view__desc player-medals">
			<Medal medal="gold" /><span class="mc-data">{player.medals.gold}</span>
			<Medal medal="silver" /><span class="mc-data">{player.medals.silver}</span>
			<Medal medal="bronze" /><span class="mc-data">{player.medals.bronze}</span>
			·
			{#if player.hallRank !== null}
				<a class="mc-link" href="/stats/hall-of-fame">Hall of Fame #{player.hallRank}</a>
				(<span class="mc-data">{player.medals.points}</span> points)
			{:else}
				Not in the Hall of Fame yet
			{/if}
		</p>
		{#if !player.active}
			<p class="stats-view__desc mc-danger" role="note">
				Inactive for more than {data.inactiveDays} days, so not currently ranked.
			</p>
		{/if}
	</header>

	<section class="mc-entry" aria-label="Awards">
		<div class="mc-box mc-table-scroll">
			<table class="mc-table">
				<thead>
					<tr>
						<th scope="col" class="mc-table__end">Rank</th>
						<th scope="col">Award</th>
						<th scope="col">Score</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as row (row.awardId)}
						<tr>
							<td class="mc-table__end"><RankBadge rank={row.rank} /></td>
							<td>
								<a class="mc-icon-label mc-link" href="/stats/awards/{row.awardId}">
									<AwardIcon id={row.awardId} />
									{row.name}
								</a>
							</td>
							<td class="mc-table__wrap">
								<span class="mc-muted">{statLabel(row.description)}:</span>
								<span class="mc-data">{row.value}</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</article>

<style>
	.player-medals {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		align-items: center;
		gap: calc(var(--px) * 2);
	}
</style>
