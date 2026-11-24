<script lang="ts">
	import { spritePaths, spriteSize, type Sprite } from '$lib/stats/sprites';

	interface Props {
		sprite: Sprite;
		/** Screen pixels per sprite pixel. */
		scale?: number;
		class?: string;
	}

	let { sprite, scale = 2, class: className }: Props = $props();

	const size = $derived(spriteSize(sprite));
	const paths = $derived(spritePaths(sprite));
</script>

<svg
	class={['pixel-sprite', className]}
	viewBox="0 0 {size.width} {size.height}"
	width={size.width * scale}
	height={size.height * scale}
	shape-rendering="crispEdges"
	aria-hidden="true"
>
	{#each paths as path (path.fill)}
		<path fill={path.fill} d={path.d} />
	{/each}
</svg>

<style>
	.pixel-sprite {
		display: inline-block;
		flex-shrink: 0;
	}
</style>
