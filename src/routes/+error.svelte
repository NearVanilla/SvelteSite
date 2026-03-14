<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>
		{$page.status === 404 ? 'Page Not Found' : 'Error'} — NearVanilla
	</title>
</svelte:head>

<main class="error-page">
	<div class="error-page__content">
		{#if $page.status === 404}
			<h1 class="error-page__code">404</h1>
			<h2 class="error-page__title">Page Not Found</h2>
			<p class="error-page__message">
				The page you're looking for doesn't exist or has been moved.
			</p>
		{:else}
			<h1 class="error-page__code">{$page.status}</h1>
			<h2 class="error-page__title">Something Went Wrong</h2>
			<p class="error-page__message">
				{$page.error?.message || 'An unexpected error occurred.'}
			</p>
		{/if}
		<a href="/" class="error-page__cta">Return Home</a>
	</div>
</main>

<style>
	.error-page {
		min-height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
	}

	.error-page__content {
		max-width: 480px;
	}

	.error-page__code {
		font-family: var(--font-display);
		font-size: clamp(4rem, 15vw, 8rem);
		font-weight: 900;
		line-height: 1;
		color: var(--color-brand-lime);
		margin: 0;
	}

	.error-page__title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 4vw, 2rem);
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin: 0.5rem 0;
	}

	.error-page__message {
		color: var(--color-text-muted);
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.error-page__cta {
		display: inline-block;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background-color: var(--color-accent);
		color: var(--color-text);
		padding: 0.7rem 1.75rem;
		border-radius: 4px;
		transition: background-color 0.15s ease;
	}

	.error-page__cta:hover {
		background-color: var(--color-accent-hover);
	}
</style>
