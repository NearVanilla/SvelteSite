<script lang="ts">
	import type { Medal } from '$lib/stats/types';

	let { medal }: { medal: Medal } = $props();

	const labels: Record<Medal, string> = {
		gold: 'Gold medal',
		silver: 'Silver medal',
		bronze: 'Bronze medal'
	};
</script>

<span class={['medal', `medal--${medal}`]} title={labels[medal]}>
	<span class="medal__label">{labels[medal]}</span>
</span>

<style>
	.medal {
		display: inline-block;
		flex-shrink: 0;
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 50%;
		box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.25);
	}

	.medal--gold {
		background-color: var(--color-medal-gold);
	}

	.medal--silver {
		background-color: var(--color-medal-silver);
	}

	.medal--bronze {
		background-color: var(--color-medal-bronze);
	}

	/* Visually hidden, still read by screen readers. */
	.medal__label {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
