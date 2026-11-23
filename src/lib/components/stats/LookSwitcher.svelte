<script lang="ts">
	import { page } from '$app/state';
	import { LOOKS, type LookId } from '$lib/stats/look';

	/** Spike-only control for comparing the Leaderboards looks. */
	let { current }: { current: LookId } = $props();
</script>

<nav class="look-switcher" aria-label="Leaderboards look (preview)">
	<p class="look-switcher__label">Look</p>
	<ul class="look-switcher__list">
		{#each LOOKS as look (look.id)}
			<li>
				<a
					class={['look-switcher__link', { 'look-switcher__link--current': look.id === current }]}
					href="{page.url.pathname}?look={look.id}"
					aria-current={look.id === current ? 'true' : undefined}
					data-sveltekit-noscroll
				>
					{look.name}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.look-switcher {
		position: fixed;
		right: 1rem;
		bottom: 1rem;
		z-index: 50;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.5rem;
		background-color: #1a1a1a;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 6px;
		font-family: var(--font-body);
		font-size: 0.8rem;
		line-height: 1.2;
		text-shadow: none;
	}

	.look-switcher__label {
		color: var(--color-text-muted);
		padding-inline: 0.25rem;
	}

	.look-switcher__list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		list-style: none;
	}

	.look-switcher__link {
		display: block;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		color: #ffffff;
	}

	.look-switcher__link:hover,
	.look-switcher__link:focus-visible {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.look-switcher__link--current {
		background-color: var(--color-accent);
	}
</style>
