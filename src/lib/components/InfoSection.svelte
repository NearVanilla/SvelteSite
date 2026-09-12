<script lang="ts">
	interface Props {
		id?: string;
		heading: string;
		headingAccent: string;
		body: string;
		alternateBackground?: boolean;
		image: string;
		imageAlt: string;
	}

	let {
		id,
		heading,
		headingAccent,
		body,
		alternateBackground = false,
		image,
		imageAlt
	}: Props = $props();
</script>

<section {id} class="info-section" class:info-section--alt={alternateBackground}>
	<div class="info-section__inner">
		<figure class="info-section__image">
			<img src={image} alt={imageAlt} loading="lazy" decoding="async" />
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
		background-color: var(--color-placeholder);
		border-radius: 4px;
		margin: 0;
		overflow: hidden;
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
	}

	@media (max-width: 768px) {
		.info-section__inner {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}
</style>
