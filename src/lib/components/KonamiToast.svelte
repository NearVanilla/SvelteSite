<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { tick } from 'svelte';
	import diamond from '$lib/assets/diamond.webp';
	import toastSound from '$lib/assets/audio/toast_in.mp3';
	import toastOutSound from '$lib/assets/audio/toast_out.mp3';

	const SEQUENCE = [
		'ArrowUp',
		'ArrowUp',
		'ArrowDown',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'ArrowLeft',
		'ArrowRight',
		'b',
		'a',
		'Enter'
	] as const;

	let progress = $state(0);
	let visible = $state(false);
	let dismissTimer: ReturnType<typeof setTimeout> | null = null;

	function handleKeydown(event: KeyboardEvent) {
		const key = event.key;
		const expected = SEQUENCE[progress];

		if (key === expected) {
			progress += 1;
			if (progress === SEQUENCE.length) {
				progress = 0;
				activate();
			}
		} else {
			progress = key === SEQUENCE[0] ? 1 : 0;
		}
	}

	async function activate() {
		if (dismissTimer) clearTimeout(dismissTimer);
		visible = false;
		await tick();
		visible = true;
		new Audio(toastSound).play();
		dismissTimer = setTimeout(() => {
			new Audio(toastOutSound).play();
			visible = false;
		}, 5000);
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

{#if visible}
	<aside
		class="mc-toast"
		role="status"
		aria-live="polite"
		aria-label="Achievement Get: You found the easter egg!"
		in:fly={{ x: -360, duration: 400, easing: cubicOut }}
		out:fly={{ x: -360, duration: 400, easing: cubicOut }}
	>
		<img
			class="mc-toast__icon"
			src={diamond}
			alt=""
			aria-hidden="true"
		/>
		<div class="mc-toast__content">
			<p class="mc-toast__title">Achievement Get!</p>
			<p class="mc-toast__lore">You found the easter egg!</p>
		</div>
	</aside>
{/if}

<style>
	.mc-toast {
		position: fixed;
		top: calc(var(--nav-height) + 1rem);
		left: 1rem;
		z-index: 99;
		display: flex;
		align-items: center;
		gap: 10px;
		width: 312px;
		height: 54px;
		padding: 0 16px;
		box-sizing: border-box;
		background-color: #3c3c3c;
		/*
		 * Minecraft GUI panel border — layered to mimic the embossed 3D look:
		 * 1. Outermost ring: near-black (darkest edge)
		 * 2. border: medium-light grey highlight (gives the raised inner frame)
		 * 3. inset shadow: slightly darker grey (inner recess)
		 * Corners stay sharp (no border-radius) for the blocky pixel look.
		 */
		border: 3px solid #888888;
		outline: 3px solid #111111;
		box-shadow: inset 0 0 0 2px #555555;
		font-family: 'Press Start 2P', 'Courier New', monospace;
		pointer-events: none;
		image-rendering: pixelated;
	}

	.mc-toast__icon {
		display: block;
		flex-shrink: 0;
		width: 30px;
		height: 30px;
		image-rendering: pixelated;
	}

	.mc-toast__content {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	/* Minecraft §e yellow = #FFFF55, shadow = 25% brightness = #3F3F15 */
	.mc-toast__title {
		margin: 0;
		color: #ffff55;
		font-size: 10px;
		line-height: 1;
		text-shadow: 2px 2px 0 #3f3f15;
	}

	/* Pure white with dark grey hard shadow — zero blur for chunky retro look */
	.mc-toast__lore {
		margin: 0;
		color: #ffffff;
		font-size: 9px;
		line-height: 1;
		text-shadow: 2px 2px 0 #3f3f3f;
	}
</style>
