<script lang="ts">
	interface Props {
		name: string;
		versionRange: string;
		fileSize: string;
		downloadHref: string;
		seasonDates: string;
		imageSrc?: string;
		imageAlt?: string;
	}

	let {
		name,
		versionRange,
		fileSize,
		downloadHref,
		seasonDates,
		imageSrc,
		imageAlt = name
	}: Props = $props();
</script>

<article class="download-card">
	{#if imageSrc}
		<figure class="download-card__thumbnail">
			<img
				src={imageSrc}
				alt={imageAlt}
				class="download-card__img"
				loading="lazy"
				decoding="async"
			/>
		</figure>
	{/if}
	<header class="download-card__header">
		<h3 class="download-card__name">{name}</h3>
	</header>
	<dl class="download-card__meta">
		<div class="download-card__meta-item">
			<dt class="download-card__meta-label">Minecraft</dt>
			<dd class="download-card__meta-value">{versionRange}</dd>
		</div>
		<div class="download-card__meta-item">
			<dt class="download-card__meta-label">File Size</dt>
			<dd class="download-card__meta-value">{fileSize}</dd>
		</div>
		<div class="download-card__meta-item download-card__meta-item--full">
			<dt class="download-card__meta-label">Season</dt>
			<dd class="download-card__meta-value">{seasonDates}</dd>
		</div>
	</dl>
	<a href={downloadHref} class="download-card__btn" aria-label="Download {name}">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="download-card__btn-icon"
			aria-hidden="true"
		>
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="7 10 12 15 17 10" />
			<line x1="12" y1="15" x2="12" y2="3" />
		</svg>
		Download
	</a>
</article>

<style>
	.download-card {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		transition: border-color 0.15s ease;
	}

	.download-card:hover {
		border-color: rgba(255, 255, 255, 0.18);
	}

	.download-card__thumbnail {
		margin: 0;
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}

	.download-card__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.3s ease;
	}

	.download-card:hover .download-card__img {
		transform: scale(1.04);
	}

	.download-card__header {
		padding: 1.5rem 1.5rem 0;
	}

	.download-card__thumbnail + .download-card__header {
		padding-top: 0;
	}

	.download-card__name {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.1rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-text);
	}

	.download-card__meta {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		padding: 0 1.5rem;
	}

	.download-card__meta-item {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.download-card__meta-item--full {
		grid-column: 1 / -1;
	}

	.download-card__meta-label {
		font-family: var(--font-display);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.download-card__meta-value {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--color-brand-sky);
		font-weight: 500;
		font-variant-numeric: tabular-nums;
	}

	.download-card__btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background-color: var(--color-accent);
		color: var(--color-text);
		padding: 0.55rem 1rem;
		border-radius: 4px;
		transition: background-color 0.15s ease;
		align-self: flex-start;
		margin: auto 1.5rem 1.5rem;
	}

	.download-card__btn:hover {
		background-color: var(--color-accent-hover);
	}

	.download-card__btn-icon {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
	}
</style>
