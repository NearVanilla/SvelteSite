<script lang="ts">
	const galleryRow1 = [0, 1, 2, 3];
	const galleryRow2 = [0, 1, 2, 3, 4];
</script>

<section class="gallery gallery--large" aria-label="Server screenshot gallery">
	{#each galleryRow1 as slot (slot)}
		<figure class="gallery__slot" aria-label="Screenshot {slot + 1} placeholder"></figure>
	{/each}
</section>

<section class="gallery gallery--small" aria-label="Server screenshot gallery continued">
	{#each galleryRow2 as slot (slot)}
		<figure class="gallery__slot" aria-label="Screenshot {slot + 5} placeholder"></figure>
	{/each}
</section>

<style>
	.gallery {
		display: flex;
		width: 100%;
		overflow: hidden;
	}

	.gallery--large {
		height: 200px;
	}

	.gallery--small {
		height: 120px;
	}

	.gallery__slot {
		flex: 1 0 0;
		margin: 0;
		background-color: #2a2f3a;
		border-right: 2px solid var(--color-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.gallery__slot:last-child {
		border-right: none;
	}

	.gallery__slot::after {
		content: '';
		display: block;
		width: 32px;
		height: 32px;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-size: contain;
		opacity: 0.5;
	}

	@media (max-width: 768px) {
		.gallery--large {
			height: 140px;
		}

		.gallery--small {
			height: 90px;
		}
	}
</style>
