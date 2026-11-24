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
	const activeCount = $derived(data.rows.filter((row) => row.active).length);
</script>

<svelte:head>
	<title>NearVanilla SMP - Players</title>
	<meta
		name="description"
		content="Every NearVanilla SMP player this season, with playtime and medals."
	/>
	<link rel="canonical" href="https://nearvanilla.com/stats/players" />
</svelte:head>

<article class="stats-view stats-view--narrow">
	<header class="stats-view__header">
		<h1 class="stats-view__title"><span class="stats-view__title-text">Players</span></h1>
		<p class="stats-view__subtitle">
			{data.rows.length} players this season, {activeCount} active
		</p>
	</header>

	<search class="player-search">
		<label for="player-search">Find a player</label>
		<input
			class="player-search__input"
			id="player-search"
			type="search"
			placeholder="Name"
			autocomplete="off"
			spellcheck="false"
			bind:value={query}
		/>
	</search>

	<section class="mc-entry" aria-label="Players">
		<div class="mc-box mc-table-scroll">
			<table class="mc-table">
				<thead>
					<tr>
						<th scope="col">Player</th>
						<th scope="col" class="mc-table__end">Playtime</th>
						<th scope="col" class="mc-table__center"><Medal medal="gold" /></th>
						<th scope="col" class="mc-table__center"><Medal medal="silver" /></th>
						<th scope="col" class="mc-table__center"><Medal medal="bronze" /></th>
						<th scope="col" class="mc-table__end">Last online</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as row (row.uuid)}
						<tr>
							<td>
								<a class="mc-player mc-link" href="/stats/players/{row.slug}">
									<PlayerAvatar uuid={row.uuid} size={32} />
									{row.name}
								</a>
							</td>
							<td class="mc-table__end mc-data">{row.playtime}</td>
							<td class="mc-table__center mc-data">{row.gold}</td>
							<td class="mc-table__center mc-data">{row.silver}</td>
							<td class="mc-table__center mc-data">{row.bronze}</td>
							<td class="mc-table__end">
								<span class={row.active ? 'mc-success' : 'mc-danger'}>{row.lastSeen}</span>
								<span class="mc-sr-only">({row.active ? 'active' : 'inactive'})</span>
							</td>
						</tr>
					{:else}
						<tr>
							<td class="mc-table__center mc-muted" colspan="6">No players match “{query}”.</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<p class="stats-view__desc player-list__note">
		Green dates are active players; red ones haven't played recently and aren't ranked.
	</p>
</article>

<style>
	.player-search {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: calc(var(--px) * 4);
		margin-bottom: calc(var(--px) * 6);
		text-shadow: var(--stats-shadow);
	}

	.player-search__input {
		min-width: 12rem;
		padding: calc(var(--px) * 2) calc(var(--px) * 4);
		border: var(--px) solid #a0a0a0;
		background-color: #000000;
		color: var(--stats-text);
		font: inherit;
	}

	.player-search__input::placeholder {
		color: #707070;
	}

	.player-search__input:focus-visible {
		outline: none;
		border-color: #ffffff;
	}

	.player-list__note {
		margin-top: calc(var(--px) * 4);
		text-align: center;
	}
</style>
