<script lang="ts">
	type NavLink = { label: string; href: string };
	type NavGroup = { label: string; children: NavLink[] };

	let isMenuOpen = $state(false);
	let openGroup = $state<string | null>(null);

	const navItems: (NavLink | NavGroup)[] = [
		{ label: 'Home', href: '/#home' },
		{ label: 'Downloads', href: '/downloads' },
		{ label: 'Map', href: 'https://map.nearvanilla.com' },
		{
			label: 'Server',
			children: [
				{ label: 'About', href: '/#about' },
				{ label: 'Plugins', href: '/#plugins' },
				{ label: 'Specs', href: '/#specs' },
				{ label: 'Staff', href: '/staff' }
			]
		}
	];

	const groupId = (label: string) => `nav-group-${label.toLowerCase()}`;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		openGroup = null;
	}

	function closeMenu() {
		isMenuOpen = false;
		openGroup = null;
	}

	function toggleGroup(label: string) {
		openGroup = openGroup === label ? null : label;
	}

	function handleWindowClick(event: MouseEvent) {
		if (openGroup && !(event.target as Element).closest('.nav__dropdown')) {
			openGroup = null;
		}
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && openGroup) {
			document.getElementById(`${groupId(openGroup)}-toggle`)?.focus();
			openGroup = null;
		}
	}

	function handleGroupFocusout(event: FocusEvent) {
		const next = event.relatedTarget as Node | null;
		if (next && !(event.currentTarget as Element).contains(next)) {
			openGroup = null;
		}
	}
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

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
			{#each navItems as item (item.label)}
				{#if 'children' in item}
					{@const id = groupId(item.label)}
					{@const isOpen = openGroup === item.label}
					<div class="nav__dropdown" onfocusout={handleGroupFocusout}>
						<button
							id="{id}-toggle"
							class="nav__link nav__dropdown-toggle"
							onclick={() => toggleGroup(item.label)}
							aria-expanded={isOpen}
							aria-controls="{id}-menu"
						>
							{item.label}
							<span class="nav__caret" class:nav__caret--open={isOpen} aria-hidden="true"></span>
						</button>
						<div id="{id}-menu" class="nav__dropdown-menu" hidden={!isOpen}>
							{#each item.children as child (child.label)}
								<a href={child.href} class="nav__link nav__dropdown-link" onclick={closeMenu}
									>{child.label}</a
								>
							{/each}
						</div>
					</div>
				{:else}
					<a href={item.href} class="nav__link" onclick={closeMenu}>{item.label}</a>
				{/if}
			{/each}
			<a href="https://discord.com/invite/KHAuj5F" class="nav__cta" onclick={closeMenu}>Apply Now</a
			>
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
	}

	/* Backdrop blur lives on a pseudo-element so .nav itself never creates
	   a new containing block for position:fixed descendants (the mobile overlay). */
	.nav::before {
		content: '';
		position: absolute;
		inset: 0;
		background-color: rgba(10, 10, 10, 0.75);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--color-border);
	}

	.nav__inner {
		position: relative;
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
		font-size: 1.4rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.nav__logo-near {
		color: var(--color-brand-lime);
		text-shadow: 0 0 14px rgb(163 230 53 / 0.35);
	}

	.nav__logo-vanilla {
		color: var(--color-brand-sky);
		text-shadow: 0 0 14px rgb(56 189 248 / 0.35);
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

	/* Dropdown group */
	.nav__dropdown {
		position: relative;
	}

	.nav__dropdown-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: none;
		border: none;
		cursor: pointer;
	}

	.nav__dropdown-toggle[aria-expanded='true'] {
		color: var(--color-text);
	}

	.nav__caret {
		width: 0.4rem;
		height: 0.4rem;
		border-right: 1.5px solid currentColor;
		border-bottom: 1.5px solid currentColor;
		transform: translateY(-2px) rotate(45deg);
		transition: transform 0.15s ease;
	}

	.nav__caret--open {
		transform: translateY(1px) rotate(-135deg);
	}

	.nav__dropdown-menu {
		position: absolute;
		top: calc(100% + 0.6rem);
		left: 0;
		display: flex;
		flex-direction: column;
		min-width: 10rem;
		padding: 0.35rem;
		background-color: rgba(10, 10, 10, 0.95);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		box-shadow: 0 8px 24px rgb(0 0 0 / 0.4);
	}

	.nav__dropdown-menu[hidden] {
		display: none;
	}

	.nav__dropdown-link {
		padding: 0.5rem 0.75rem;
	}

	.nav__dropdown-link:hover {
		background-color: rgb(255 255 255 / 0.05);
	}

	.nav__cta {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background-color: var(--color-accent);
		color: var(--color-text);
		padding: 0.35rem 0.9rem;
		margin-left: 1rem;
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

		.nav__dropdown {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.nav__dropdown-menu {
			position: static;
			align-items: center;
			min-width: 0;
			padding: 0;
			background: none;
			border: none;
			box-shadow: none;
		}

		.nav__dropdown-link {
			font-size: 1.05rem;
			padding: 0.5rem 1.5rem;
		}

		.nav__dropdown-link:hover {
			background: none;
		}

		.nav__cta {
			font-size: 0.9rem;
			padding: 0.6rem 1.25rem;
			margin-left: 0;
		}
	}
</style>
