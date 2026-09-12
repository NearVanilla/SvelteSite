<script lang="ts">
	import { onMount } from 'svelte';
	import type { StaffMember, StaffRole } from '$lib/data/staff';
	import { formatSinceDate, formatTenure } from '$lib/utils/staff-time';

	let {
		member,
		role,
		onclose
	}: {
		member: StaffMember;
		role: StaffRole;
		onclose: () => void;
	} = $props();

	const flagMap: Record<string, string> = {
		Poland: '🇵🇱',
		'United Kingdom': '🇬🇧',
		Canada: '🇨🇦',
		Wales: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
		'United States': '🇺🇸',
		Netherlands: '🇳🇱',
		Norway: '🇳🇴',
		Sweden: '🇸🇪'
	};

	let dialog: HTMLDialogElement;
	let closeButton: HTMLButtonElement;
	let dismissed = false;
	let release: (() => void) | undefined;
	let now = $state(Date.now());
	const minute = $derived(Math.floor(now / 60_000));
	const instant = $derived(new Date(minute * 60_000));
	const timeFormatter = $derived(
		member.timeZone
			? new Intl.DateTimeFormat('en-US', {
					hour: '2-digit',
					minute: '2-digit',
					timeZone: member.timeZone,
					timeZoneName: 'short'
				})
			: undefined
	);
	const localTime = $derived(timeFormatter?.format(instant) ?? '');
	const sinceDate = $derived(formatSinceDate(member.since));
	const tenure = $derived(formatTenure(member.since, instant));

	function dismiss(): void {
		if (dismissed) return;
		dismissed = true;
		release?.();
		dialog.close();
		onclose();
	}

	function handleCancel(event: Event): void {
		event.preventDefault();
		dismiss();
	}

	function handleBackdropClick(event: MouseEvent): void {
		if (event.target === event.currentTarget) dismiss();
	}

	onMount(() => {
		dialog.showModal();
		closeButton.focus();
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		now = Date.now();
		const interval = setInterval(() => {
			now = Date.now();
		}, 1000);

		release = () => {
			clearInterval(interval);
			document.body.style.overflow = previousOverflow;
			release = undefined;
		};

		return () => {
			dismissed = true;
			release?.();
			// Removing the dialog disposes native modality without refocusing a departing route.
		};
	});
</script>

<dialog
	bind:this={dialog}
	class="modal-backdrop"
	aria-labelledby="modal-title"
	oncancel={handleCancel}
	onclick={handleBackdropClick}
>
	<article class="modal">
		<button
			bind:this={closeButton}
			type="button"
			class="modal__close"
			onclick={dismiss}
			aria-label="Close profile">✕</button
		>
		<section class="modal__card" aria-label="Staff profile">
			<div class="modal__skin-col">
				<img
					class="modal__body"
					src="https://mc-heads.net/body/{member.name}"
					alt="{member.name}'s Minecraft skin"
				/>
			</div>
			<div class="modal__info-col">
				<header class="modal__header">
					<div class="modal__header-text">
						<h2 id="modal-title" class="modal__name modal__name--{role}">{member.name}</h2>
						{#if member.tagline}
							<p class="modal__tagline">{member.tagline}</p>
						{/if}
						{#if sinceDate}
							<p class="modal__since">
								<span class="modal__since-label">Joined</span>
								{sinceDate}
								{#if tenure}
									<span class="modal__since-sep">·</span>
									<span class="modal__time-served">{tenure}</span>
								{/if}
							</p>
						{/if}
					</div>
				</header>

				{#if member.location || member.timeZone}
					<div class="modal__location">
						{#if member.location}
							<span class="modal__location-item">
								<span class="modal__location-icon" aria-hidden="true"
									>{flagMap[member.location] ?? '🌍'}</span
								>
								{member.location}
							</span>
						{/if}
						{#if member.timeZone}
							<span class="modal__location-item">
								<span class="modal__location-icon" aria-hidden="true">🕐</span>
								<span class="modal__local-time">{localTime}</span>
							</span>
						{/if}
					</div>
				{/if}

				{#if member.quote}
					<blockquote class="modal__quote">
						<span class="modal__quote-mark" aria-hidden="true">&ldquo;</span>
						<p class="modal__quote-text">{member.quote}</p>
					</blockquote>
				{/if}
			</div>
		</section>
	</article>
</dialog>

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		box-sizing: border-box;
		width: 100%;
		max-width: none;
		height: 100dvh;
		max-height: none;
		margin: 0;
		border: none;
		padding: 1.5rem;
		background: transparent;
		color: var(--color-text);
		overflow: hidden;
	}

	.modal-backdrop[open] {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-backdrop::backdrop {
		background-color: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(4px);
		animation: backdrop-in 0.2s ease-out forwards;
	}

	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal {
		background:
			linear-gradient(135deg, rgba(59, 130, 246, 0.08), transparent 42%), var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 16px;
		padding: 0;
		max-width: 720px;
		width: 100%;
		max-height: calc(100dvh - 3rem);
		position: relative;
		overflow-y: auto;
		overscroll-behavior: contain;
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
		animation: modal-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	@keyframes modal-in {
		from {
			opacity: 0;
			transform: scale(0.92);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.modal__card {
		display: flex;
		gap: 0;
	}

	.modal__skin-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: 1rem;
		padding: clamp(1.75rem, 4vw, 2.75rem);
		padding-right: 0;
		flex-shrink: 0;
	}

	.modal__body {
		width: 120px;
		height: auto;
		image-rendering: pixelated;
		flex-shrink: 0;
	}

	.modal__info-col {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.25rem;
		padding: clamp(1.75rem, 4vw, 2.75rem);
		padding-left: 1.5rem;
		flex: 1;
		min-width: 0;
	}

	.modal__close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		color: var(--color-text-muted);
		font-size: 1.25rem;
		cursor: pointer;
		padding: 0.25rem;
		min-width: 44px;
		min-height: 44px;
		line-height: 1;
		z-index: 10;
	}

	.modal__close:hover {
		color: var(--color-text);
	}

	.modal__header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding-right: 2rem;
	}

	.modal__header-text {
		min-width: 0;
		text-align: left;
	}

	.modal__name {
		overflow-wrap: anywhere;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		letter-spacing: 0.05em;
		line-height: 0.95;
		margin-bottom: 0.5rem;
	}

	.modal__name--admin {
		color: #22c55e;
	}

	.modal__name--moderator {
		color: #3b82f6;
	}

	.modal__name--helper {
		color: #f97316;
	}

	.modal__tagline {
		font-size: 1.05rem;
		color: var(--color-text-muted);
	}

	.modal__since {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		margin-top: 0.35rem;
	}

	.modal__since-label {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.7rem;
		font-weight: 600;
		margin-right: 0.35rem;
	}

	.modal__since-sep {
		margin: 0 0.35rem;
	}

	.modal__time-served {
		color: var(--color-brand-sky);
	}

	.modal__location {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.5rem;
	}

	.modal__location-item {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	.modal__location-icon {
		font-size: 0.9rem;
	}

	.modal__local-time {
		color: var(--color-brand-lime);
		font-weight: 500;
	}

	.modal__quote {
		position: relative;
		padding: 0.75rem 1rem;
		background-color: rgba(59, 130, 246, 0.08);
		border-left: 3px solid var(--color-accent);
		border-radius: 0 6px 6px 0;
		margin: 0;
		width: 100%;
	}

	.modal__quote-mark {
		position: absolute;
		top: -0.1rem;
		left: 0.5rem;
		font-size: 2rem;
		font-family: Georgia, serif;
		color: var(--color-accent);
		opacity: 0.35;
		line-height: 1;
		pointer-events: none;
	}

	.modal__quote-text {
		font-size: 0.9rem;
		font-style: italic;
		color: var(--color-text-muted);
		line-height: 1.5;
		padding-left: 0.5rem;
	}

	@media (max-width: 600px) {
		.modal__card {
			flex-direction: column;
			min-height: 0;
			align-items: center;
		}

		.modal__skin-col {
			padding: 1.5rem 1.5rem 0;
			align-items: center;
			width: 100%;
		}

		.modal__body {
			width: 100px;
		}

		.modal__info-col {
			padding: 1.25rem 1.5rem 1.5rem;
			width: 100%;
			align-items: stretch;
		}

		.modal__header {
			flex-direction: column;
			padding-right: 1.5rem;
			align-items: flex-start;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.modal,
		.modal-backdrop::backdrop {
			animation: none;
		}
	}
</style>
