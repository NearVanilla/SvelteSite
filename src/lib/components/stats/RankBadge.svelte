<script lang="ts">
	import Crown from './Crown.svelte';
	import Medal from './Medal.svelte';
	import { rankClass } from '$lib/stats/rank-class';
	import type { Medal as MedalKind } from '$lib/stats/types';

	interface Props {
		rank: number | null;
		/** Medal for award rankings, crown for the Hall of Fame. */
		kind?: 'medal' | 'crown';
	}

	let { rank, kind = 'medal' }: Props = $props();

	const medals: Record<number, MedalKind> = { 1: 'gold', 2: 'silver', 3: 'bronze' };
	const medal = $derived(rank === null ? undefined : medals[rank]);
</script>

<span class="mc-rank">
	{#if medal && rank !== null}
		{#if kind === 'crown'}<Crown {rank} />{:else}<Medal {medal} />{/if}
	{/if}
	<span class={rankClass(rank)}>{rank === null ? '-' : `#${rank}`}</span>
</span>
