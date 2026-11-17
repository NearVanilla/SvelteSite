<script lang="ts">
	import Medal from '$lib/components/stats/Medal.svelte';
	import PlayerAvatar from '$lib/components/stats/PlayerAvatar.svelte';

	let { data } = $props();

	let query = $state('');
	const filtered = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return data.rows;
		return data.rows.filter((row) => row.name.toLowerCase().includes(needle));
	});
</script>

<svelte:head>
	<title>NearVanilla SMP - Players</title>
	<meta
		name="description"
		content="Every NearVanilla SMP player this season, with playtime and medals."
	/>
	<link rel="canonical" href="https://nearvanilla.com/stats/players" />
</svelte:head>

<article class="stats-page">
	<header class="stats-page__header">
		<h1 class="stats-page__title">Players</h1>
		<p class="stats-page__desc">Everyone who has played this season.</p>
	</header>

	<search class="player-search">
		<label class="player-search__label" for="player-search">Find a player</label>
		<input
			class="player-search__input"
			id="player-search"
			type="search"
			placeholder="Name…"
			autocomplete="off"
			spellcheck="false"
			bind:value={query}
		/>
	</search>

	<section class="stats-table-wrap">
		<table class="stats-table">
			<caption>{filtered.length} of {data.rows.length} players</caption>
			<thead>
				<tr>
					<th scope="col">Player</th>
					<th scope="col" class="stats-table__num">Playtime</th>
					<th scope="col">Last seen</th>
					<th scope="col" class="stats-table__num"><Medal medal="gold" /></th>
					<th scope="col" class="stats-table__num"><Medal medal="silver" /></th>
					<th scope="col" class="stats-table__num"><Medal medal="bronze" /></th>
					<th scope="col">Status</th>
				</tr>
			</thead>
			<tbody>
				{#each filtered as row (row.uuid)}
					<tr>
						<td>
							<a class="stats-player" href="/stats/players/{row.slug}">
								<PlayerAvatar uuid={row.uuid} size={28} />
								<span class="stats-player__name">{row.name}</span>
							</a>
						</td>
						<td class="stats-table__num">{row.playtime}</td>
						<td>{row.lastSeen}</td>
						<td class="stats-table__num">{row.gold}</td>
						<td class="stats-table__num">{row.silver}</td>
						<td class="stats-table__num">{row.bronze}</td>
						<td>
							<span class={['player-status', { 'player-status--inactive': !row.active }]}>
								{row.active ? 'Active' : 'Inactive'}
							</span>
						</td>
					</tr>
				{:else}
					<tr>
						<td class="player-search__empty" colspan="7">No players match “{query}”.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</article>

<style>
	.player-search {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.player-search__label {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.85rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.player-search__input {
		flex: 1;
		min-width: 12rem;
		max-width: 22rem;
		padding: 0.55rem 0.85rem;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		background-color: var(--color-surface);
		color: var(--color-text);
		font: inherit;
	}

	.player-search__input:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 1px;
	}

	.player-search__empty {
		text-align: center;
		color: var(--color-text-muted);
	}

	.player-status {
		font-size: 0.85rem;
		color: var(--color-brand-lime);
	}

	.player-status--inactive {
		color: var(--color-text-muted);
	}
</style>
