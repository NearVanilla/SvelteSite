<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { onMount, untrack } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';

	const mobile = new MediaQuery('(max-width: 900px)');
	let dialog: HTMLDialogElement;
	let toggle: HTMLButtonElement;
	let desktopNav: HTMLElement;
	let isMenuOpen = $state(false);

	const navLinks = [
		{ label: 'Home', href: '/#home' },
		{ label: 'About', href: '/#about' },
		{ label: 'Plugins', href: '/#plugins' },
		{ label: 'Specs', href: '/#specs' },
		{ label: 'Downloads', href: '/downloads' },
		{ label: 'Staff', href: '/staff' }
	];

	function openMenu() {
		if (!mobile.current || dialog.open) return;
		dialog.showModal();
		isMenuOpen = true;
		dialog.querySelector<HTMLAnchorElement>('a')?.focus();
	}

	function closeMenu(restoreFocus: boolean = true): void {
		if (!dialog?.open) return;
		dialog.close();
		isMenuOpen = false;
		if (restoreFocus && mobile.current) toggle.focus();
	}

	afterNavigate(() => closeMenu(false));

	$effect(() => {
		const isMobile = mobile.current;
		untrack(() => {
			if (!isMobile) closeMenu(false);
			else if (desktopNav?.contains(document.activeElement)) toggle.focus();
		});
	});

	$effect(() => {
		if (!isMenuOpen) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	});

	onMount(() => () => dialog.close());
</script>

{#snippet navigationLinks()}
	{#each navLinks as link (link.label)}
		<a href={link.href} class="nav__link" onclick={() => closeMenu(false)}>{link.label}</a>
	{/each}
	<a href="https://discord.com/invite/KHAuj5F" class="nav__cta" onclick={() => closeMenu(false)}>
		Apply Now
	</a>
{/snippet}

<header class="nav">
	<div class="nav__inner">
		<a href="/" class="nav__logo" onclick={() => closeMenu(false)}
			><span class="nav__logo-near">Near</span><span class="nav__logo-vanilla">Vanilla</span></a
		>

		<button
			bind:this={toggle}
			class="nav__toggle"
			onclick={openMenu}
			aria-expanded={isMenuOpen}
			aria-label="Open menu"
			aria-controls="main-menu"
		>
			<span class="nav__toggle-icon" class:nav__toggle-icon--open={isMenuOpen}>
				<span></span>
				<span></span>
				<span></span>
			</span>
		</button>

		<nav bind:this={desktopNav} class="nav__links" aria-label="Main navigation">
			{@render navigationLinks()}
		</nav>
	</div>
</header>

<dialog
	bind:this={dialog}
	id="main-menu"
	class="nav__dialog"
	aria-label="Main menu"
	oncancel={(event) => {
		event.preventDefault();
		closeMenu();
	}}
>
	<button class="nav__close" aria-label="Close menu" onclick={() => closeMenu()}>✕</button>
	<nav class="nav__mobile-links" aria-label="Main navigation">
		{@render navigationLinks()}
	</nav>
</dialog>

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
	}

	/* Keep the fixed header's background separate from its content. */
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
		background-color: var(--color-accent-surface);
		color: var(--color-text);
		padding: 0.35rem 0.9rem;
		border-radius: 4px;
		white-space: nowrap;
		transition: background-color 0.15s ease;
	}

	.nav__cta:hover {
		background-color: var(--color-accent-surface-hover);
	}

	/* Mobile menu toggle */
	.nav__toggle {
		display: none;
		background: none;
		border: none;
		padding: 0.5rem;
		width: 44px;
		height: 44px;
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

	.nav__dialog {
		position: fixed;
		inset: 0;
		width: 100%;
		max-width: none;
		height: 100dvh;
		max-height: none;
		margin: 0;
		padding: calc(var(--nav-height) + 1rem) 1.5rem 1.5rem;
		border: 0;
		background: rgba(10, 10, 10, 0.98);
		color: var(--color-text);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.nav__dialog[open] {
		display: flex;
		flex-direction: column;
		animation: menu-enter 0.25s ease;
	}

	.nav__dialog::backdrop {
		background: rgba(10, 10, 10, 0.95);
	}

	.nav__close {
		position: absolute;
		top: 2px;
		right: 1.5rem;
		width: 44px;
		height: 44px;
		border: 0;
		background: none;
		color: inherit;
		font-size: 1.5rem;
	}

	.nav__mobile-links {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		margin-block: auto;
		flex-shrink: 0;
	}

	.nav__mobile-links .nav__link {
		font-size: 1.25rem;
		padding: 0.75rem 1.5rem;
	}

	.nav__mobile-links .nav__cta {
		font-size: 0.9rem;
		padding: 0.6rem 1.25rem;
	}

	@keyframes menu-enter {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 900px) {
		.nav__toggle {
			display: block;
		}
		.nav__links {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.nav__dialog[open] {
			animation: none;
		}
		.nav__toggle-icon span {
			transition: none;
		}
	}
</style>
