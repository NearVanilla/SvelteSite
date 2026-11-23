<script lang="ts">
	import { page } from '$app/state';

	const links = [
		{
			label: 'Awards',
			href: '/stats',
			matches: (path: string) => path === '/stats' || path.startsWith('/stats/awards')
		},
		{
			label: 'Hall of Fame',
			href: '/stats/hall-of-fame',
			matches: (path: string) => path.startsWith('/stats/hall-of-fame')
		},
		{
			label: 'Players',
			href: '/stats/players',
			matches: (path: string) => path.startsWith('/stats/players')
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
	/* Colours, sizes and bevels come from the look's --nav-* tokens in stats.css. */
	.stats-nav {
		padding: var(--px);
		background-color: var(--nav-box);
		border-radius: var(--stats-box-radius);
		clip-path: var(--stats-corners);
	}

	.stats-nav__list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--nav-gap);
		list-style: none;
	}

	.stats-nav__link {
		display: inline-block;
		min-width: var(--nav-min-width);
		padding: var(--nav-padding);
		border: var(--px) solid var(--nav-border);
		background-color: var(--nav-bg);
		box-shadow: var(--nav-bevel);
		font-family: var(--nav-font);
		font-weight: var(--nav-weight);
		font-size: var(--nav-size);
		line-height: var(--stats-leading);
		text-align: center;
		color: var(--nav-text);
		text-shadow: var(--nav-text-shadow);
		text-decoration: none;
	}

	.stats-nav__link:hover,
	.stats-nav__link:focus-visible {
		background-color: var(--nav-hover-bg);
		box-shadow: var(--nav-hover-bevel);
		color: var(--nav-hover-text);
		text-decoration: var(--nav-hover-decoration);
		outline: var(--nav-hover-outline);
		outline-offset: 0;
	}

	.stats-nav__link:focus-visible {
		outline: var(--px) solid currentColor;
	}

	.stats-nav__link--current {
		background-color: var(--nav-current-bg);
		box-shadow: var(--nav-current-bevel);
		color: var(--nav-current-text);
		text-shadow: var(--nav-current-text-shadow, var(--nav-text-shadow));
	}
</style>
