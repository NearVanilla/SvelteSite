<script lang="ts">
	import spawnImg from '$lib/assets/screenshots/spawn.webp';
</script>

<section class="hero" aria-label="Server hero image">
	<figure class="hero__figure">
		<img src={spawnImg} alt="NearVanilla spawn area" class="hero__img" />
		<figcaption class="hero__content">
			<p class="hero__eyebrow">Welcome to</p>
			<h1 class="hero__title">Near<span class="hero__title-accent">Vanilla</span></h1>
			<p class="hero__subtitle">
				A Semi-Vanilla Minecraft Survival Server that puts the community first.
			</p>
			<div class="hero__actions">
				<a href="#apply" class="hero__cta">Join the Server</a>
				<a
					href="https://map.nearvanilla.com"
					class="hero__secondary"
					rel="noopener noreferrer"
					target="_blank"
					aria-label="View NearVanilla live map (opens in new tab)">View Live Map</a
				>
			</div>
		</figcaption>
	</figure>
</section>

<style>
	.hero {
		width: 100%;
		margin-top: calc(var(--nav-height) * -1);
		padding-top: var(--nav-height);
	}

	.hero__figure {
		position: relative;
		width: 100%;
		height: 100vh;
		margin: 0;
		overflow: hidden;
	}

	.hero__figure::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.8) 0%,
			rgba(0, 0, 0, 0.25) 50%,
			transparent 100%
		);
		z-index: 1;
		pointer-events: none;
	}

	.hero__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.hero__content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		width: 100%;
		max-width: 900px;
		padding: 0 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
	}

	.hero__eyebrow {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.9rem;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--color-accent);
	}

	.hero__title {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(3.5rem, 10vw, 7rem);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-brand-lime);
		text-shadow: 0 2px 24px rgba(0, 0, 0, 0.6);
	}

	.hero__title-accent {
		color: var(--color-brand-sky);
	}

	.hero__subtitle {
		font-size: clamp(0.9rem, 2vw, 1.05rem);
		color: rgba(255, 255, 255, 0.85);
		max-width: 520px;
		line-height: 1.7;
		text-shadow: 0 1px 10px rgba(0, 0, 0, 0.6);
	}

	.hero__actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 0.25rem;
	}

	.hero__cta {
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

	.hero__cta:hover {
		background-color: var(--color-accent-hover);
	}

	.hero__secondary {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background-color: transparent;
		color: var(--color-text);
		padding: 0.7rem 1.75rem;
		border-radius: 4px;
		border: 1px solid rgba(255, 255, 255, 0.4);
		transition:
			border-color 0.15s ease,
			background-color 0.15s ease;
	}

	.hero__secondary:hover {
		border-color: rgba(255, 255, 255, 0.8);
		background-color: rgba(255, 255, 255, 0.07);
	}
</style>
