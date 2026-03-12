<script lang="ts">
	const pluginLinks = [
		{ label: 'Go to Dynmap', href: '/map' },
		{ label: 'Go to Store Online', href: '/store' },
		{ label: 'Community Discord', href: '/discord' },
		{ label: 'Profile Server', href: '/server' },
		{ label: 'View Player Map', href: '/map' },
		{ label: 'Service Status Menu', href: '/status' }
	];
</script>

<section class="plugins-section">
	<div class="plugins-section__inner">
		<div class="plugins-section__left">
			<h2 class="plugins-section__heading">
				Our <span class="accent">Plugins</span>
			</h2>
			<p class="plugins-section__desc">
				NearVanilla runs a carefully curated set of plugins designed to enhance your experience
				without straying from the vanilla feel. Browse our store, track statistics, and stay
				connected through our suite of community tools.
			</p>
			<div class="plugins-section__links">
				{#each pluginLinks as link (link.label)}
					<a href={link.href} class="plugin-btn">{link.label}</a>
				{/each}
			</div>
		</div>

		<article class="dynmap-card">
			<h3 class="dynmap-card__heading">Dynmap</h3>
			<p class="dynmap-card__desc">
				Explore the NearVanilla world in real-time using our live map. Browse the terrain, find
				player-built towns, and plan your next adventure — all from your browser without logging in.
			</p>
			<a href="/map" class="dynmap-card__link">Open Dynmap &rarr;</a>
		</article>
	</div>
</section>

<style>
	.plugins-section {
		background-color: var(--color-bg);
		padding: 4rem 1.5rem;
	}

	.plugins-section__inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
		align-items: start;
		max-width: 1100px;
		margin: 0 auto;
	}

	.plugins-section__heading {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.8rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		margin-bottom: 0.75rem;
	}

	.plugins-section__desc {
		font-size: 0.85rem;
		color: var(--color-text-muted);
		line-height: 1.7;
		margin-bottom: 1.5rem;
	}

	.plugins-section__links {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.plugin-btn {
		display: block;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-accent);
		background-color: transparent;
		border: 1px solid var(--color-accent);
		border-radius: 3px;
		padding: 0.5rem 0.75rem;
		text-align: center;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.plugin-btn:hover {
		background-color: var(--color-accent);
		color: var(--color-text);
	}

	.dynmap-card {
		background-color: var(--color-accent);
		border-radius: 6px;
		padding: 1.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.dynmap-card__heading {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.5rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.dynmap-card__desc {
		font-size: 0.85rem;
		line-height: 1.7;
		opacity: 0.9;
	}

	.dynmap-card__link {
		display: inline-block;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		background-color: rgba(0, 0, 0, 0.25);
		color: var(--color-text);
		padding: 0.5rem 1rem;
		border-radius: 3px;
		align-self: flex-start;
		transition: background-color 0.15s ease;
	}

	.dynmap-card__link:hover {
		background-color: rgba(0, 0, 0, 0.4);
	}

	@media (max-width: 768px) {
		.plugins-section__inner {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		.plugins-section__links {
			grid-template-columns: 1fr;
		}
	}
</style>
