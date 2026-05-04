<script lang="ts">
	interface StaffMember {
		name: string;
		since: string;
		badge: string;
		tagline?: string;
		location?: string;
		timezone?: string;
		responsibilities?: string[];
		quote?: string;
	}

	const staff = {
		admin: [
			{
				name: 'Prof_Bloodstone',
				since: '2018-08-13',
				badge: 'Admin',
				tagline: 'Server Owner',
				location: 'Poland',
				timezone: 'CEST',
				responsibilities: ['Server Ownership', 'Plugin Development', 'Tech Mentoring'],
				quote: 'Consider yourself lucky… or cursed.'
			},
			{
				name: '105hua',
				since: '2024-09-23',
				badge: 'Admin',
				tagline: 'Tech Lead & Server Manager',
				location: 'United Kingdom',
				timezone: 'BST',
				responsibilities: ['Server Infrastructure', 'Configuration', 'Troubleshooting'],
				quote: 'Most of what happens behind the scenes passes through here.'
			},
			{
				name: 'LoquaciousFox_',
				since: '2020-07-04',
				badge: 'Admin',
				tagline: 'Community Leader',
				location: 'Canada',
				timezone: 'EST',
				responsibilities: ['Community Events', 'Staff Meetings', 'Player Support'],
				quote: 'Jack of All Trades, master of… well, a few.'
			},
			{
				name: 'Sblod',
				since: '2024-10-02',
				badge: 'Admin',
				tagline: 'Events Manager',
				location: 'Wales',
				timezone: 'BST',
				responsibilities: ['Event Coordination', 'Community Engagement'],
				quote: 'Every great event starts with a spark.'
			}
		] as StaffMember[],
		moderator: [
			{
				name: 'Biz_Block',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'Shopping District Maintainer',
				location: 'United States',
				timezone: 'EST',
				responsibilities: ['Player Moderation', 'Conflict Resolution'],
				quote: 'Fairness is a block best placed carefully.'
			},
			{
				name: 'Demonstrations',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'Tech Team Member',
				location: 'Wales',
				timezone: 'BST',
				responsibilities: ['New Player Guidance', 'Rule Enforcement'],
				quote: 'Show, do not just tell.'
			},
			{
				name: 'Dynant',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'Tech Team Member',
				location: 'Netherlands',
				timezone: 'CET',
				responsibilities: ['World Exploration', 'Community Building'],
				quote: 'There is always more to discover.'
			},
			{
				name: 'kNaLLx',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'Shopping District Maintainer & Community Moderator',
				location: 'Norway',
				timezone: 'CEST',
				responsibilities: ['Technical Support', 'Redstone Community'],
				quote: 'With enough redstone, anything is possible.'
			},
			{
				name: 'Lego_monkeyman',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'Shopping District Maintainer & Community Moderator',
				location: 'United Kingdom',
				timezone: 'BST',
				responsibilities: ['Build Oversight', 'Creative Support'],
				quote: 'Every block is a step toward something epic.'
			},
			{
				name: 'SuprGamr',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'Events Organiser',
				location: 'Sweden',
				timezone: 'CEST',
				responsibilities: ['PvP Events', 'Competitive Moderation'],
				quote: 'May the best crafter win.'
			},
			{
				name: 'Muffinz',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'All-Rounder',
				location: 'Canada',
				timezone: 'EST',
				responsibilities: ['Community Fun', 'Player Engagement'],
				quote: 'Cats make everything better.'
			},
			{
				name: 'Toystory2wasok',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'Community Moderator',
				location: 'United States',
				timezone: 'EST',
				responsibilities: ['Lore & Storytelling', 'Community Content'],
				quote: 'Every player has a story worth telling.'
			},
			{
				name: 'VividLilyBug949',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'Onboarding & Community Moderator',
				location: 'United States',
				timezone: 'EDT',
				responsibilities: ['Issue Resolution', 'Player Support'],
				quote: 'I didn’t fail, I just found 100 ways that don’t work.'
			}
		] as StaffMember[],
		helper: [
			{
				name: 'HaakonASH',
				since: '2026-01-08',
				badge: 'Helper',
				tagline: 'Community Helper',
				location: 'Norway',
				timezone: 'CEST',
				responsibilities: ['New Player Help', 'General Support'],
				quote: 'Every expert was once a beginner.'
			},
			{
				name: 'Nollita',
				since: '2026-01-08',
				badge: 'Helper',
				tagline: 'Community Helper',
				location: 'Netherlands',
				timezone: 'CEST',
				responsibilities: ['Player Welcoming', 'Community Support'],
				quote: 'A friendly hello goes a long way.'
			},
			{
				name: 'TaintedBird',
				since: '2026-01-08',
				badge: 'Helper',
				tagline: 'Community Helper',
				location: 'United Kingdom',
				timezone: 'BST',
				responsibilities: ['Creative Support', 'Community Building'],
				quote: 'Free as a bird, helpful as a helper.'
			},
			{
				name: 'WiscoSippi',
				since: '2026-01-08',
				badge: 'Helper',
				tagline: 'Sippin through life',
				location: 'United States',
				timezone: 'CST',
				responsibilities: ['Relaxed Support', 'Community Vibes'],
				quote: 'Take it one sip at a time.'
			}
		] as StaffMember[]
	};

	let selectedMember = $state<StaffMember | null>(null);
	let isClosing = $state(false);
	let localTime = $state('');

	const tzMap: Record<string, string> = {
		GMT: 'Europe/London',
		BST: 'Europe/London',
		EST: 'America/New_York',
		EDT: 'America/New_York',
		PST: 'America/Los_Angeles',
		CST: 'America/Chicago',
		MST: 'America/Denver',
		CET: 'Europe/Paris',
		CEST: 'Europe/Paris',
		AEST: 'Australia/Sydney'
	};

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

	function openModal(member: StaffMember) {
		selectedMember = member;
		isClosing = false;
		updateLocalTime();
	}

	function updateLocalTime() {
		if (!selectedMember?.timezone) {
			localTime = '';
			return;
		}
		const iana = tzMap[selectedMember.timezone];
		if (!iana) {
			localTime = '';
			return;
		}
		localTime = new Date().toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			timeZone: iana
		});
	}

	$effect(() => {
		if (selectedMember?.timezone) {
			updateLocalTime();
			const interval = setInterval(updateLocalTime, 1000);
			return () => clearInterval(interval);
		}
	});

	function closeModal() {
		isClosing = true;
		setTimeout(() => {
			selectedMember = null;
			isClosing = false;
		}, 200);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeModal();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	}

	function formatSinceDate(date: string) {
		const d = new Date(`${date}T00:00:00Z`);
		return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
	}

	function getTimeServed(since: string): string {
		const start = new Date(`${since}T00:00:00Z`);
		const now = new Date();
		let years = now.getUTCFullYear() - start.getUTCFullYear();
		let months = now.getUTCMonth() - start.getUTCMonth();
		if (months < 0) {
			years--;
			months += 12;
		}
		const parts: string[] = [];
		if (years > 0) parts.push(`${years} year${years === 1 ? '' : 's'}`);
		if (months > 0) parts.push(`${months} month${months === 1 ? '' : 's'}`);
		if (parts.length === 0) return 'Just joined';
		return parts.join(', ');
	}
</script>

<svelte:head>
	<title>Staff — NearVanilla</title>
	<meta
		name="description"
		content="Meet the NearVanilla staff team. Our admins, moderators, and helpers keep the server running smoothly."
	/>
	<link rel="canonical" href="https://nearvanilla.com/staff" />
</svelte:head>

<section class="staff-hero">
	<div class="staff-hero__inner">
		<p class="staff-hero__eyebrow">Team</p>
		<h1 class="staff-hero__title">Our <span class="staff-hero__title-accent">Staff</span></h1>
		<p class="staff-hero__desc">
			The dedicated team that keeps NearVanilla running smoothly and maintains a welcoming community
			for all players.
		</p>
	</div>
</section>

<section class="staff-section">
	<div class="staff-section__inner">
		<div class="staff-tier">
			<h2 class="staff-tier__title staff-tier__title--admin">Admins</h2>
			<ul class="staff-list" role="list">
				{#each staff.admin as member (member.name)}
					<li>
						<button
							class="staff-card staff-card--admin"
							onclick={() => openModal(member)}
							aria-label="View profile for {member.name}"
						>
							<img
								class="staff-card__avatar"
								src="https://mc-heads.net/head/{member.name}"
								alt="{member.name}'s Minecraft head"
								loading="lazy"
							/>
							<div class="staff-card__info">
								<span class="staff-card__name">{member.name}</span>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		</div>

		<div class="staff-tier">
			<h2 class="staff-tier__title staff-tier__title--moderator">Moderators</h2>
			<ul class="staff-list" role="list">
				{#each staff.moderator as member (member.name)}
					<li>
						<button
							class="staff-card staff-card--moderator"
							onclick={() => openModal(member)}
							aria-label="View profile for {member.name}"
						>
							<img
								class="staff-card__avatar"
								src="https://mc-heads.net/head/{member.name}"
								alt="{member.name}'s Minecraft head"
								loading="lazy"
							/>
							<div class="staff-card__info">
								<span class="staff-card__name">{member.name}</span>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		</div>

		<div class="staff-tier">
			<h2 class="staff-tier__title staff-tier__title--helper">Helpers</h2>
			<ul class="staff-list" role="list">
				{#each staff.helper as member (member.name)}
					<li>
						<button
							class="staff-card staff-card--helper"
							onclick={() => openModal(member)}
							aria-label="View profile for {member.name}"
						>
							<img
								class="staff-card__avatar"
								src="https://mc-heads.net/head/{member.name}"
								alt="{member.name}'s Minecraft head"
								loading="lazy"
							/>
							<div class="staff-card__info">
								<span class="staff-card__name">{member.name}</span>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<svelte:window onkeydown={handleKeydown} />

{#if selectedMember}
	<div
		class="modal-backdrop{isClosing ? ' modal-backdrop--closing' : ''}"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<article class="modal{isClosing ? ' modal--closing' : ''}" role="document">
			<button class="modal__close" onclick={closeModal} aria-label="Close profile">✕</button>
			<section class="modal__card" aria-label="Staff profile">
				<div class="modal__skin-col">
					<img
						class="modal__body"
						src="https://mc-heads.net/body/{selectedMember.name}"
						alt="{selectedMember.name}'s Minecraft skin"
					/>
				</div>
				<div class="modal__info-col">
					<header class="modal__header">
						<div class="modal__header-text">
							<h2
								id="modal-title"
								class="modal__name modal__name--{selectedMember.badge.toLowerCase()}"
							>
								{selectedMember.name}
							</h2>
							{#if selectedMember.tagline}
								<p class="modal__tagline">{selectedMember.tagline}</p>
							{/if}
							<p class="modal__since">
								<span class="modal__since-label">Joined</span>
								{formatSinceDate(selectedMember.since)}
								<span class="modal__since-sep">·</span>
								<span class="modal__time-served">{getTimeServed(selectedMember.since)}</span>
							</p>
						</div>
					</header>

					{#if selectedMember.location || selectedMember.timezone}
						<div class="modal__location">
							{#if selectedMember.location}
								<span class="modal__location-item">
									<span class="modal__location-icon" aria-hidden="true"
										>{flagMap[selectedMember.location] ?? '🌍'}</span
									>
									{selectedMember.location}
								</span>
							{/if}
							{#if selectedMember.timezone}
								<span class="modal__location-item">
									<span class="modal__location-icon" aria-hidden="true">🕐</span>
									{selectedMember.timezone}
									{#if localTime}
										<span class="modal__local-time">({localTime})</span>
									{/if}
								</span>
							{/if}
						</div>
					{/if}

					{#if selectedMember.quote}
						<blockquote class="modal__quote">
							<span class="modal__quote-mark" aria-hidden="true">&ldquo;</span>
							<p class="modal__quote-text">{selectedMember.quote}</p>
						</blockquote>
					{/if}
				</div>
			</section>
		</article>
	</div>
{/if}

<style>
	.staff-hero {
		background-color: var(--color-surface-alt);
		border-bottom: 1px solid var(--color-border);
		padding: clamp(2.5rem, 5vw, 4rem) 1.5rem;
	}

	.staff-hero__inner {
		max-width: 1100px;
		margin: 0 auto;
		text-align: center;
	}

	.staff-hero__eyebrow {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.8rem;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--color-accent);
		margin-bottom: 0.75rem;
	}

	.staff-hero__title {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(2rem, 5vw, 3.5rem);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-brand-lime);
		margin-bottom: 1.25rem;
	}

	.staff-hero__title-accent {
		color: var(--color-brand-sky);
	}

	.staff-hero__desc {
		font-size: clamp(0.875rem, 1.5vw, 1rem);
		color: var(--color-text-muted);
		max-width: 560px;
		margin: 0 auto;
		line-height: 1.7;
	}

	.staff-section {
		padding: clamp(2.5rem, 5vw, 5rem) 1.5rem;
	}

	.staff-section__inner {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.staff-tier {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.staff-tier__title {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(1.25rem, 2.5vw, 1.75rem);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		line-height: 1;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid;
	}

	.staff-tier__title--admin {
		color: #22c55e;
		border-color: #22c55e;
	}

	.staff-tier__title--moderator {
		color: #3b82f6;
		border-color: #3b82f6;
	}

	.staff-tier__title--helper {
		color: #f97316;
		border-color: #f97316;
	}

	.staff-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1rem;
		list-style: none;
	}

	.staff-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		padding: 0.875rem 1rem;
		transition: border-color 0.15s ease;
		width: 100%;
		text-align: left;
		cursor: pointer;
		font-family: inherit;
		color: inherit;
	}

	.staff-card:hover {
		border-color: rgba(255, 255, 255, 0.15);
	}

	.staff-card__avatar {
		width: 36px;
		height: 36px;
		flex-shrink: 0;
	}

	.staff-card__info {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
	}

	.staff-card__name {
		font-weight: 500;
		font-size: 0.9rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.modal-backdrop {
		position: fixed;
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1.5rem;
		animation: backdrop-in 0.2s ease-out forwards;
	}

	.modal-backdrop--closing {
		animation: backdrop-out 0.2s ease-in forwards;
	}

	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes backdrop-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
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
		position: relative;
		overflow: hidden;
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
		animation: modal-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	.modal--closing {
		animation: modal-out 0.2s ease-in forwards;
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

	@keyframes modal-out {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(0.92);
		}
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1.5rem;
		animation: backdrop-in 0.2s ease-out forwards;
	}

	.modal-backdrop--closing {
		animation: backdrop-out 0.2s ease-in forwards;
	}

	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes backdrop-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
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
		text-align: left;
	}

	.modal__name {
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
		opacity: 0.5;
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
		opacity: 0.9;
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
		.staff-list {
			grid-template-columns: 1fr;
		}

		.modal {
			max-width: 100%;
			max-height: calc(100svh - 3rem);
			overflow-y: auto;
		}

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
</style>
