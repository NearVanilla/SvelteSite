<script lang="ts">
	interface Props {
		heading: string;
		headingAccent: string;
		body: string;
		alt?: boolean;
		image?: string;
		imageAlt?: string;
	}

	let { heading, headingAccent, body, alt = false, image, imageAlt = '' }: Props = $props();
</script>

<section class="info-section" class:info-section--alt={alt}>
	<div class="info-section__inner">
		<figure
			class="info-section__image"
			class:info-section__image--filled={image}
			aria-label={image
				? imageAlt || `${heading} ${headingAccent}`
				: `${heading} ${headingAccent} image placeholder`}
		>
			{#if image}
				<img src={image} alt={imageAlt || `${heading} ${headingAccent}`} />
			{/if}
		</figure>
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
		padding: clamp(4rem, 7vw, 8rem) clamp(1.5rem, 4vw, 3rem);
	}

	.info-section--alt {
		background-color: var(--color-surface-alt);
	}

	.info-section__inner {
		display: grid;
		grid-template-columns: 5fr 6fr;
		gap: 2.5rem;
		align-items: center;
		max-width: 1400px;
		margin: 0 auto;
	}

	.info-section__image {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		background-color: #2a2f3a;
		border-radius: 4px;
		margin: 0;
		overflow: hidden;
	}

	.info-section__image::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 48px;
		height: 48px;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-size: contain;
	}

	.info-section__image--filled::after {
		display: none;
	}

	.info-section__image img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.info-section__content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0;
	}

	.info-section__heading {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		line-height: 1.1;
	}

	.info-section__content p {
		font-size: clamp(0.875rem, 1.1vw, 1rem);
		color: var(--color-text-muted);
		line-height: 1.7;
	}

	@media (max-width: 900px) {
		.info-section__inner {
			gap: 1.75rem;
		}

		.info-section__content {
			padding: 0;
		}
	}

	@media (max-width: 768px) {
		.info-section__inner {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.info-section__content {
			padding: 0;
		}
	}
</style>
