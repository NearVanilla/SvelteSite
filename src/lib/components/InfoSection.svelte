<script lang="ts">
	interface Props {
		heading: string;
		headingAccent: string;
		body: string;
		alt?: boolean;
	}

	let { heading, headingAccent, body, alt = false }: Props = $props();
</script>

<section class="info-section" class:info-section--alt={alt}>
	<div class="info-section__inner">
		<figure
			class="info-section__image"
			aria-label="{heading} {headingAccent} image placeholder"
		></figure>
		<div class="info-section__content">
			<h2 class="info-section__heading">
				{heading} <span class="accent">{headingAccent}</span>
			</h2>
			<p>{body}</p>
		</div>
	</div>
</section>

<style>
	.info-section {
		background-color: var(--color-bg);
		padding: 4rem 1.5rem;
	}

	.info-section--alt {
		background-color: var(--color-surface-alt);
	}

	.info-section__inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
		align-items: center;
		max-width: 1100px;
		margin: 0 auto;
	}

	.info-section__image {
		aspect-ratio: 4 / 3;
		background-color: #2a2f3a;
		border-radius: 4px;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.info-section__image::after {
		content: '';
		display: block;
		width: 64px;
		height: 64px;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-size: contain;
	}

	.info-section__content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.info-section__heading {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 2rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		line-height: 1.1;
	}

	.info-section__content p {
		font-size: 0.9rem;
		color: var(--color-text-muted);
		line-height: 1.7;
	}

	@media (max-width: 768px) {
		.info-section__inner {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}
</style>
