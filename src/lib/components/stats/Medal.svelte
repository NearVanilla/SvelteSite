<script lang="ts">
	import bronze from '$lib/assets/stats/fatcow/medal_award_bronze.png';
	import gold from '$lib/assets/stats/fatcow/medal_award_gold.png';
	import silver from '$lib/assets/stats/fatcow/medal_award_silver.png';
	import type { Medal } from '$lib/stats/types';

	/** FatCow "Farm-Fresh" medal icon (CC BY 3.0), shown at its native 32px. */
	let { medal }: { medal: Medal } = $props();

	const icons: Record<Medal, { src: string; label: string }> = {
		gold: { src: gold, label: 'Gold medal' },
		silver: { src: silver, label: 'Silver medal' },
		bronze: { src: bronze, label: 'Bronze medal' }
	};
</script>

<img
	class="medal"
	src={icons[medal].src}
	alt={icons[medal].label}
	title={icons[medal].label}
	width="32"
	height="32"
/>

<style>
	.medal {
		display: inline-block;
		flex-shrink: 0;
		vertical-align: middle;
		image-rendering: auto;
	}
</style>
