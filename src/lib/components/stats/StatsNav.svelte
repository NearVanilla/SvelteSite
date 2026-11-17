<script lang="ts">
	import { page } from '$app/state';

	const links = [
		{
			label: 'Awards',
			href: '/stats',
			matches: (path: string) => path === '/stats' || path.startsWith('/stats/awards')
		},
		{
			label: 'Players',
			href: '/stats/players',
			matches: (path: string) => path.startsWith('/stats/players')
		},
		{
			label: 'Hall of Fame',
			href: '/stats/hall-of-fame',
			matches: (path: string) => path.startsWith('/stats/hall-of-fame')
		}
	];
</script>

<nav class="stats-nav" aria-label="Leaderboards">
	<ul class="stats-nav__list">
		{#each links as link (link.href)}
			{@const current = link.matches(page.url.pathname)}
			<li>
				<a
					class={['stats-nav__link', { 'stats-nav__link--current': current }]}
					href={link.href}
					aria-current={current ? 'page' : undefined}
				>
					{link.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.stats-nav__list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		list-style: none;
	}

	.stats-nav__link {
		display: inline-block;
		padding: 0.45rem 1.1rem;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.85rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		text-decoration: none;
		transition:
			color 0.2s ease,
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	.stats-nav__link:hover,
	.stats-nav__link:focus-visible {
		color: var(--color-text);
		border-color: var(--color-accent);
	}

	.stats-nav__link--current {
		color: var(--color-text);
		background-color: var(--color-accent-dim);
		border-color: var(--color-accent);
	}
</style>
