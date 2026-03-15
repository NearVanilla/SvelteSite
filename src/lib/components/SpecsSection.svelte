<script lang="ts">
	import SpecCard from './SpecCard.svelte';
</script>

<section id="specs" class="specs-section">
	<div class="specs-section__inner">
		<h2 class="specs-section__heading">
			Server <span class="accent">Specs</span>
		</h2>
		<p class="specs-section__desc">
			NearVanilla runs on dedicated hardware so you get a smooth, lag-free experience every time you
			log in. Here's a look at what powers the server.
		</p>
		<div class="specs-grid">
			<SpecCard label="Processor" value="AMD Ryzen 7 7700" sub="3.8-5.3 GHz">
				{#snippet icon()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="4" y="4" width="16" height="16" rx="2" />
						<rect x="9" y="9" width="6" height="6" />
						<path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
					</svg>
				{/snippet}
			</SpecCard>

			<SpecCard label="Storage" value="2 TB" sub="NVMe">
				{#snippet icon()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="2" y="6" width="20" height="12" rx="2" />
						<path d="M16 12h.01M12 12h.01" />
					</svg>
				{/snippet}
			</SpecCard>

			<SpecCard label="RAM" value="64 GB DDR5" sub="4800 MHz">
				{#snippet icon()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="2" y="8" width="20" height="8" rx="1" />
						<path d="M6 8V6M10 8V6M14 8V6M18 8V6M6 16v2M10 16v2M14 16v2M18 16v2" />
					</svg>
				{/snippet}
			</SpecCard>

			<SpecCard label="Network" value="1 Gbit/s" sub="1000 Mbps">
				{#snippet icon()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M4.5 12.5a8 8 0 0 1 15 0" />
						<path d="M7.5 15.5a4 4 0 0 1 9 0" />
						<circle cx="12" cy="19" r="1" fill="currentColor" />
					</svg>
				{/snippet}
			</SpecCard>
		</div>
	</div>
</section>

<style>
	.specs-section {
		background-color: var(--color-surface-alt);
		padding: clamp(2.5rem, 5vw, 5rem) 1.5rem;
	}

	.specs-section__inner {
		max-width: 1100px;
		margin: 0 auto;
		text-align: center;
	}

	.specs-section__heading {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(1.5rem, 2.5vw, 2rem);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-bottom: 0.75rem;
	}

	.specs-section__desc {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		max-width: 580px;
		margin: 0 auto 2.5rem;
		line-height: 1.7;
	}

	.specs-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	@media (max-width: 480px) {
		.specs-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
