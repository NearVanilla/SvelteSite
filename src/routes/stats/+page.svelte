<script lang="ts">
	import AwardIcon from '$lib/components/stats/AwardIcon.svelte';
	import PlayerAvatar from '$lib/components/stats/PlayerAvatar.svelte';
	import { statLabel } from '$lib/stats/format';

	let { data } = $props();

	/** Every award in one alphabetical list, each with its current holder. */
	const awards = $derived(
		data.categories
			.flatMap((group) =>
				group.awards.map((award) => ({ ...award, category: group.category, best: award.top[0] }))
			)
			.sort((a, b) => a.name.localeCompare(b.name))
	);
</script>

<svelte:head>
	<title>NearVanilla SMP - Leaderboards</title>
	<meta
		name="description"
		content="Season leaderboards for NearVanilla SMP: who has mined, fought, travelled and built the most."
	/>
	<link rel="canonical" href="https://nearvanilla.com/stats" />
</svelte:head>

<article class="stats-view">
	<header class="stats-view__header">
		<h1 class="stats-view__title"><span class="stats-view__title-text">Awards</span></h1>
		<p class="stats-view__desc">
			Who holds each award right now. Only players seen in the last {data.inactiveDays} days are ranked.
		</p>
	</header>

	<ul class="award-grid">
		{#each awards as award (award.id)}
			<li class="mc-entry">
				<h2 class="mc-box award-card__title">
					<AwardIcon id={award.id} />
					<a class="mc-link" href="/stats/awards/{award.id}">{award.name}</a>
				</h2>
				<p class="mc-box award-card__holder">
					{#if award.best}
						<a class="mc-player mc-link" href="/stats/players/{award.best.slug}">
							<PlayerAvatar uuid={award.best.uuid} size={32} />
							{award.best.name}
						</a>
						<br />
						{statLabel(award.description)}: <span class="mc-data">{award.best.value}</span>
					{:else}
						<span class="mc-muted">Nobody yet</span>
						<br />
						<span class="mc-muted">({statLabel(award.description)})</span>
					{/if}
				</p>
			</li>
		{/each}
	</ul>
</article>

<style>
	.award-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: calc(var(--px) * 6) calc(var(--px) * 12);
		list-style: none;
	}

	@media (max-width: 575px) {
		.award-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.award-card__title {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: calc(var(--px) * 3);
		font-weight: 400;
		font-size: inherit;
		text-align: center;
	}

	.award-card__holder {
		flex: 1;
		text-align: center;
	}
</style>
