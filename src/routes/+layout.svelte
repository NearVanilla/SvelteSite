<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a href="#main-content" class="skip-link">Skip to main content</a>

<Nav />
<main id="main-content">
	{@render children()}
</main>
<Footer />

<style>
	.skip-link {
		position: absolute;
		top: -100px;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--color-accent);
		color: var(--color-text);
		padding: 0.75rem 1.5rem;
		border-radius: 0 0 4px 4px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		z-index: 1000;
		transition: top 0.2s ease;
	}

	.skip-link:focus {
		top: 0;
		outline: none;
	}

	main {
		min-height: calc(100vh - var(--nav-height) - 91px);
		padding-top: var(--nav-height);
	}
</style>
