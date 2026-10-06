<script lang="ts">
	interface StaffMember {
		name: string;
		since: number;
		badge: string;
		location?: string;
		responsibilities?: string[];
	}

	const staff = {
		admin: [
			{
				name: 'Prof_Bloodstone',
				since: 2016,
				badge: 'Admin',
				location: 'Poland',
				responsibilities: ['Server Ownership', 'Plugin Development', 'Tech Mentoring']
			},
			{
				name: '105hua',
				since: 2024,
				badge: 'Admin',
				location: 'United Kingdom',
				responsibilities: ['Server Infrastructure', 'Configuration', 'Troubleshooting']
			},
			{
				name: 'LoquaciousFox_',
				since: 2020,
				badge: 'Admin',
				location: 'Canada',
				responsibilities: ['Community Events', 'Staff Meetings', 'Player Support']
			},
			{
				name: 'Sblod',
				since: 2022,
				badge: 'Admin',
				location: 'Wales',
				responsibilities: ['Event Coordination', 'Community Engagement']
			},
			{
				name: 'Mufffinz',
				since: 2022,
				badge: 'Admin',
				location: 'Canada',
				responsibilities: ['Community Fun', 'Player Engagement']
			}
		] as StaffMember[],
		moderator: [
			{
				name: 'Biz_Block',
				since: 2023,
				badge: 'Moderator',
				location: 'United States',
				responsibilities: ['Player Moderation', 'Conflict Resolution']
			},
			{
				name: 'Demonstrations',
				since: 2022,
				badge: 'Moderator',
				location: 'Wales',
				responsibilities: ['New Player Guidance', 'Rule Enforcement']
			},
			{
				name: 'Dynant',
				since: 2022,
				badge: 'Moderator',
				location: 'Netherlands',
				responsibilities: ['World Exploration', 'Community Building']
			},
			{
				name: 'kNaLLx',
				since: 2019,
				badge: 'Moderator',
				location: 'Sweden',
				responsibilities: ['Technical Support', 'Redstone Community']
			},
			{
				name: 'Lego_monkeyman',
				since: 2025,
				badge: 'Moderator',
				location: 'United Kingdom',
				responsibilities: ['Build Oversight', 'Creative Support']
			},
			{
				name: 'Toystory2wasok',
				since: 2022,
				badge: 'Moderator',
				location: 'United States',
				responsibilities: ['Lore & Storytelling', 'Community Content']
			},
			{
				name: 'VividLilyBug949',
				since: 2025,
				badge: 'Moderator',
				location: 'United States',
				responsibilities: ['Issue Resolution', 'Player Support']
			}
		] as StaffMember[],
		helper: [
			{
				name: 'HaakonASH',
				since: 2021,
				badge: 'Helper',
				location: 'Norway',
				responsibilities: ['New Player Help', 'General Support']
			},
			{
				name: 'Nollita',
				since: 2022,
				badge: 'Helper',
				location: 'Netherlands',
				responsibilities: ['Player Welcoming', 'Community Support']
			},
			{
				name: 'TaintedBird',
				since: 2023,
				badge: 'Helper',
				location: 'United Kingdom',
				responsibilities: ['Creative Support', 'Community Building']
			},
			{
				name: 'femb0y3',
				since: 2025,
				badge: 'Helper',
				location: 'United States'
			}
		] as StaffMember[]
	};

	let selectedMember = $state<StaffMember | null>(null);
	let isClosing = $state(false);
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
	}

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

	function getTimeServed(since: number): string {
		const years = new Date().getUTCFullYear() - since;
		if (years <= 0) return 'Less than a year';
		return `${years} year${years === 1 ? '' : 's'}`;
	}
</script>

<svelte:head>
	<title>NearVanilla SMP - Staff</title>
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
							<p class="modal__since">
								<span class="modal__since-label">Joined</span>
								{selectedMember.since}
								<span class="modal__time-served">{getTimeServed(selectedMember.since)}</span>
							</p>
						</div>
					</header>

					{#if selectedMember.location}
						<div class="modal__location">
							<span class="modal__location-item">
								<span class="modal__location-icon" aria-hidden="true"
									>{flagMap[selectedMember.location] ?? '🌍'}</span
								>
								{selectedMember.location}
							</span>
						</div>
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

	.modal {
		background:
			linear-gradient(135deg, rgba(59, 130, 246, 0.08), transparent 42%), var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 16px;
		padding: 0;
		max-width: 480px;
		width: 100%;
		max-height: calc(100svh - 2rem);
		position: relative;
		overflow: auto;
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
		padding: 1rem;
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
		display: grid;
		grid-template-columns: 72px minmax(0, 1fr);
		align-items: center;
		gap: 1.5rem;
		padding: 1.5rem;
	}

	.modal__skin-col {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal__body {
		display: block;
		width: 100%;
		height: auto;
		image-rendering: pixelated;
	}

	.modal__info-col {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
		min-width: 0;
	}

	.modal__close {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 44px;
		height: 44px;
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
		padding-right: 0.75rem;
	}

	.modal__header-text {
		text-align: left;
	}

	.modal__name {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.5rem;
		letter-spacing: 0.01em;
		line-height: 1.2;
		overflow-wrap: anywhere;
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

	.modal__since {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin-top: 0.35rem;
	}

	.modal__since-label {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.7rem;
		font-weight: 600;
		margin-right: 0.35rem;
	}

	.modal__time-served {
		display: block;
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

	@media (max-width: 600px) {
		.staff-list {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 400px) {
		.modal__card {
			grid-template-columns: 56px minmax(0, 1fr);
			gap: 1rem;
			padding: 2.5rem 1rem 1.25rem;
		}

		.modal__header {
			padding-right: 0;
		}

		.modal__name {
			font-size: 1.25rem;
		}
	}
</style>
