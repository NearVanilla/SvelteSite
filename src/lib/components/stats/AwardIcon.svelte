<script lang="ts">
	import { asset } from '$app/paths';

	/**
	 * An award's Minecraft item or block icon (static/images/stats/award-icons/<id>.png, built by
	 * scripts/stats-icons.py; every icon is 18x18). Drawn at a whole-number scale. Decorative.
	 */
	let { id, scale = 2 }: { id: string; scale?: number } = $props();

	const ICON_SIZE = 18;
</script>

<img
	class="award-icon"
	src={asset(`/images/stats/award-icons/${id}.png`)}
	alt=""
	width={ICON_SIZE * scale}
	height={ICON_SIZE * scale}
	loading="lazy"
/>

<style>
	.award-icon {
		display: inline-block;
		flex-shrink: 0;
		vertical-align: middle;
		image-rendering: pixelated;
	}
</style>
