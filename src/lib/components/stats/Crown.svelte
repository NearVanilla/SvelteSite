<script lang="ts">
	import bronze from '$lib/assets/stats/fatcow/crown_bronze.png';
	import gold from '$lib/assets/stats/fatcow/crown_gold.png';
	import silver from '$lib/assets/stats/fatcow/crown_silver.png';

	/** FatCow "Farm-Fresh" crown icon (CC BY 3.0) for Hall of Fame ranks 1-3, at its native 32px. */
	let { rank }: { rank: number } = $props();

	const icons: Record<number, { src: string; label: string }> = {
		1: { src: gold, label: 'Gold crown' },
		2: { src: silver, label: 'Silver crown' },
		3: { src: bronze, label: 'Bronze crown' }
	};
	const icon = $derived(icons[rank]);
</script>

{#if icon}
	<img class="crown" src={icon.src} alt={icon.label} title={icon.label} width="32" height="32" />
{/if}

<style>
	.crown {
		display: inline-block;
		flex-shrink: 0;
		vertical-align: middle;
		image-rendering: auto;
	}
</style>
