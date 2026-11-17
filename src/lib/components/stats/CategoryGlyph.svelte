<script lang="ts">
	import type { AwardCategory } from '$lib/stats/types';

	let { category }: { category: AwardCategory } = $props();
</script>

<svg
	class="category-glyph"
	viewBox="0 0 24 24"
	width="20"
	height="20"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if category === 'mining'}
		<path d="M5 19 15 9" />
		<path d="M8 5c4-1.5 8-.5 11 3" />
		<path d="M12.5 6.5 17.5 11.5" />
	{:else if category === 'combat'}
		<path d="M19 5 9 15" />
		<path d="M19 5h-3l-9 9" />
		<path d="M6 13l5 5" />
		<path d="M5 19l2.5-2.5" />
	{:else if category === 'travel'}
		<circle cx="12" cy="12" r="8" />
		<path d="M15 9l-2 4-4 2 2-4z" />
	{:else if category === 'farming'}
		<path d="M12 21V9" />
		<path d="M12 13c-3 0-5-2-5-5 3 0 5 2 5 5z" />
		<path d="M12 11c3 0 5-2 5-5-3 0-5 2-5 5z" />
		<path d="M12 9c0-2 0-4 0-6" />
	{:else if category === 'crafting'}
		<rect x="4" y="4" width="16" height="16" rx="1" />
		<path d="M4 9.33h16M4 14.67h16M9.33 4v16M14.67 4v16" />
	{:else if category === 'building'}
		<path d="M3 20h18" />
		<path d="M4 20v-5h8v5M12 20v-5h8v5" />
		<path d="M8 15v-5h8v5" />
	{:else}
		<path d="M12 4l2.4 5 5.6.6-4.2 3.8 1.2 5.6L12 16.2 7 19l1.2-5.6L4 9.6 9.6 9z" />
	{/if}
</svg>

<style>
	.category-glyph {
		display: inline-block;
		flex-shrink: 0;
		color: var(--color-brand-sky);
	}
</style>
