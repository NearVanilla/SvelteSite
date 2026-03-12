<script lang="ts">
	const navLinks = [
		{ label: 'Server', href: '/server' },
		{ label: 'Players', href: '/players' },
		{ label: 'Map', href: '/map' },
		{ label: 'Other', href: '/other' }
	];
</script>

<header class="nav">
	<div class="nav__inner">
		<a href="/" class="nav__logo"
			><span class="nav__logo-near">Near</span><span class="nav__logo-vanilla">Vanilla</span></a
		>

		<nav class="nav__links" aria-label="Main navigation">
			{#each navLinks as link (link.label)}
				<a href={link.href} class="nav__link">{link.label}</a>
			{/each}
		</nav>

		<a href="#apply" class="nav__cta">Apply Now</a>
	</div>
</header>

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background-color: rgba(10, 10, 10, 0.75);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--color-border);
	}

	.nav__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 48px;
	}

	.nav__logo {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.1rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.nav__logo-near {
		color: var(--color-brand-lime);
	}

	.nav__logo-vanilla {
		color: var(--color-brand-sky);
	}

	.nav__links {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.nav__link {
		font-family: var(--font-body);
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--color-text-muted);
		padding: 0.35rem 0.75rem;
		border-radius: 4px;
		transition: color 0.15s ease;
	}

	.nav__link:hover {
		color: var(--color-text);
	}

	.nav__cta {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background-color: var(--color-accent);
		color: var(--color-text);
		padding: 0.45rem 1rem;
		border-radius: 4px;
		white-space: nowrap;
		transition: background-color 0.15s ease;
	}

	.nav__cta:hover {
		background-color: var(--color-accent-hover);
	}
</style>
