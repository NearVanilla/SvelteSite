<script lang="ts">
	let isMenuOpen = $state(false);

	const navLinks = [
		{ label: 'Server', href: '/server' },
		{ label: 'Players', href: '/players' },
		{ label: 'Map', href: '/map' },
		{ label: 'Other', href: '/other' }
	];

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}
</script>

<header class="nav" class:nav--open={isMenuOpen}>
	<div class="nav__inner">
		<a href="/" class="nav__logo" onclick={closeMenu}
			><span class="nav__logo-near">Near</span><span class="nav__logo-vanilla">Vanilla</span></a
		>

		<button
			class="nav__toggle"
			onclick={toggleMenu}
			aria-expanded={isMenuOpen}
			aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
			aria-controls="main-nav"
		>
			<span class="nav__toggle-icon" class:nav__toggle-icon--open={isMenuOpen}>
				<span></span>
				<span></span>
				<span></span>
			</span>
		</button>

		<nav
			id="main-nav"
			class="nav__links"
			class:nav__links--open={isMenuOpen}
			aria-label="Main navigation"
		>
			{#each navLinks as link (link.label)}
				<a href={link.href} class="nav__link" onclick={closeMenu}>{link.label}</a>
			{/each}
			<a href="#apply" class="nav__cta" onclick={closeMenu}>Apply Now</a>
		</nav>
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
		height: var(--nav-height);
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

	/* Mobile menu toggle */
	.nav__toggle {
		display: none;
		background: none;
		border: none;
		padding: 0.5rem;
		cursor: pointer;
		z-index: 110;
	}

	.nav__toggle-icon {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 22px;
	}

	.nav__toggle-icon span {
		display: block;
		height: 2px;
		background-color: var(--color-text);
		border-radius: 1px;
		transition:
			transform 0.2s ease,
			opacity 0.2s ease;
	}

	.nav__toggle-icon--open span:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}

	.nav__toggle-icon--open span:nth-child(2) {
		opacity: 0;
	}

	.nav__toggle-icon--open span:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	/* Mobile styles */
	@media (max-width: 640px) {
		.nav__toggle {
			display: block;
		}

		.nav__links {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(10, 10, 10, 0.95);
			backdrop-filter: blur(12px);
			-webkit-backdrop-filter: blur(12px);
			flex-direction: column;
			justify-content: center;
			gap: 1.5rem;
			opacity: 0;
			visibility: hidden;
			transition:
				opacity 0.25s ease,
				visibility 0.25s ease;
		}

		.nav__links--open {
			opacity: 1;
			visibility: visible;
		}

		.nav__link {
			font-size: 1.25rem;
			padding: 0.75rem 1.5rem;
		}

		.nav__cta {
			font-size: 0.9rem;
			padding: 0.6rem 1.25rem;
		}
	}
</style>
