<script lang="ts">
	import CategoryGlyph from '$lib/components/stats/CategoryGlyph.svelte';
	import Medal from '$lib/components/stats/Medal.svelte';
	import PlayerAvatar from '$lib/components/stats/PlayerAvatar.svelte';

	let { data } = $props();
	const player = $derived(data.player);
</script>

<svelte:head>
	<title>NearVanilla SMP - {player.name}</title>
	<meta name="description" content="{player.name}'s awards and medals on NearVanilla SMP." />
	<link rel="canonical" href="https://nearvanilla.com/stats/players/{player.slug}" />
</svelte:head>

<article class="stats-page stats-page--narrow">
	<header class="player-header">
		<PlayerAvatar uuid={player.uuid} size={96} />
		<section class="player-header__info" aria-label="Summary">
			<h1 class="stats-page__title player-header__name">{player.name}</h1>
			<dl class="player-facts">
				<div class="player-facts__item">
					<dt>Last seen</dt>
					<dd>{player.lastSeen}</dd>
				</div>
				<div class="player-facts__item">
					<dt>Playtime</dt>
					<dd>{player.playtime}</dd>
				</div>
				<div class="player-facts__item">
					<dt>Medals</dt>
					<dd class="player-facts__medals">
						<Medal medal="gold" />
						{player.medals.gold}
						<Medal medal="silver" />
						{player.medals.silver}
						<Medal medal="bronze" />
						{player.medals.bronze}
					</dd>
				</div>
				<div class="player-facts__item">
					<dt>Hall of Fame</dt>
					<dd>
						{#if player.hallRank !== null}
							<a class="player-facts__link" href="/stats/hall-of-fame">#{player.hallRank}</a>
							· {player.medals.points} pts
						{:else}
							Unranked
						{/if}
					</dd>
				</div>
			</dl>
		</section>
	</header>

	{#if !player.active}
		<p class="player-inactive" role="note">
			Inactive for more than {data.inactiveDays} days, so not currently ranked. Rankings return next time
			they play.
		</p>
	{/if}

	{#each data.categories as group (group.category)}
		<section class="player-category" aria-labelledby="category-{group.category}">
			<h2 class="player-category__title" id="category-{group.category}">
				<CategoryGlyph category={group.category} />
				{group.label}
			</h2>
			<div class="stats-table-wrap">
				<table class="stats-table">
					<thead>
						<tr>
							<th scope="col">Award</th>
							<th scope="col" class="stats-table__num">Value</th>
							<th scope="col" class="stats-table__num">Rank</th>
						</tr>
					</thead>
					<tbody>
						{#each group.rows as row (row.awardId)}
							<tr>
								<td><a class="stats-player" href="/stats/awards/{row.awardId}">{row.name}</a></td>
								<td class="stats-table__num">{row.value}</td>
								<td class="stats-table__num">
									<span class="stats-rank">
										{#if row.medal}<Medal medal={row.medal} />{/if}
										{row.rank ?? '–'}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/each}
</article>

<style>
	.player-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.player-header__info {
		flex: 1;
		min-width: 14rem;
	}

	.player-header__name {
		text-align: left;
	}

	.player-facts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.75rem;
	}

	.player-facts dt {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.player-facts__medals {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-variant-numeric: tabular-nums;
	}

	.player-facts__link {
		color: var(--color-brand-sky);
	}

	.player-inactive {
		margin-bottom: 2rem;
		padding: 0.75rem 1rem;
		border-left: 3px solid var(--color-text-muted);
		background-color: var(--color-surface);
		color: var(--color-text-muted);
	}

	.player-category {
		margin-bottom: 2rem;
	}

	.player-category__title {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.3rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-bottom: 0.75rem;
	}
</style>
