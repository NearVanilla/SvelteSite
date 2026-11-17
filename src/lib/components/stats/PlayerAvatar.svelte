<script module lang="ts">
	/** Public head-render service, keyed by UUID. Swap here to change provider. */
	export const AVATAR_BASE = 'https://mc-heads.net/avatar';
</script>

<script lang="ts">
	import fallback from '$lib/assets/stats/avatar-fallback.svg';

	interface Props {
		uuid: string;
		size?: number;
	}

	let { uuid, size = 32 }: Props = $props();

	let failedUuid = $state<string | null>(null);
	const src = $derived(failedUuid === uuid ? fallback : `${AVATAR_BASE}/${uuid}/${size}`);
</script>

<!-- Decorative: the player's name is always shown next to it. -->
<img
	class="player-avatar"
	{src}
	alt=""
	width={size}
	height={size}
	loading="lazy"
	onerror={() => (failedUuid = uuid)}
/>

<style>
	.player-avatar {
		display: block;
		flex-shrink: 0;
		border-radius: 3px;
		background-color: var(--color-placeholder);
		image-rendering: pixelated;
	}
</style>
