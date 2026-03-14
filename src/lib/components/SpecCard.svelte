<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		value: string;
		sub: string;
		icon: Snippet;
	}

	let { label, value, sub, icon }: Props = $props();
</script>

<article class="spec-card">
	<div class="spec-card__icon" aria-hidden="true">
		{@render icon()}
	</div>
	<h3 class="spec-card__label">{label}</h3>
	<p class="spec-card__value">{value}</p>
	<p class="spec-card__sub">{sub}</p>
</article>

<style>
	.spec-card {
		background-color: var(--color-accent);
		border-radius: 6px;
		padding: 1.25rem 0.75rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		text-align: center;
	}

	.spec-card__icon {
		width: 2rem;
		height: 2rem;
		color: var(--color-text);
	}

	.spec-card__icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.spec-card__label {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.spec-card__value {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.9rem;
	}

	.spec-card__sub {
		font-size: 0.75rem;
		opacity: 0.8;
		line-height: 1.4;
	}
</style>
