<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';

	interface StaffMember {
		name: string;
		bio?: string;
		since: string;
		badge: string;
		tagline?: string;
		funFact?: string;
	}

	const bioCache = new SvelteMap<string, string>();

	async function loadBio(path: string): Promise<string | null> {
		if (bioCache.has(path)) return bioCache.get(path)!;
		try {
			const res = await fetch(path);
			if (!res.ok) return null;
			const text = await res.text();
			bioCache.set(path, text);
			return text;
		} catch {
			return null;
		}
	}

	const staff = {
		admin: [
			{
				name: 'Prof_Bloodstone',
				bio: '/staff/bios/Prof_Bloodstone.txt',
				since: '2018-08-13',
				badge: 'Admin',
				tagline: 'Server Owner',
				funFact: 'Has been playing Minecraft since 2010'
			},
			{
				name: '105hua',
				bio: '/staff/bios/105hua.txt',
				since: '2024-09-23',
				badge: 'Admin',
				tagline: 'Tech Lead & Server Manager',
				funFact: 'Has built over 500 redstone contraptions'
			},
			{ name: 'LoquaciousFox_', bio: '/staff/bios/Loqi.txt', since: '2020-07-04', badge: 'Admin', tagline: 'Community Leader' },
			{ name: 'Sblod', since: '2024-10-02', badge: 'Admin', tagline: 'Events Manager' }
		] as StaffMember[],
		moderator: [
			{
				name: 'Biz_Block',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'Keeping peace on the server'
			},
			{
				name: 'Demonstrations',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'Helpful and fair'
			},
			{
				name: 'Dynant',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'Explorer of worlds'
			},
			{ name: 'kNaLLx', since: '2022-01-08', badge: 'Moderator', tagline: 'Redstone enthusiast' },
			{
				name: 'Lego_monkeyman',
				since: '2022-01-08',
				badge: 'Moderator',
				tagline: 'Builder of epic structures'
			},
			{ name: 'SuprGamr', since: '2022-01-08', badge: 'Moderator', tagline: 'PvP champion' },
			{ name: 'Muffinz', since: '2022-01-08', badge: 'Moderator', tagline: 'Cat lover' },
			{ name: 'Toystory2wasok', since: '2022-01-08', badge: 'Moderator', tagline: 'Storyteller' },
			{ name: 'VividLilyBug949', since: '2022-01-08', badge: 'Moderator', tagline: 'Bug fixer' }
		] as StaffMember[],
		helper: [
			{ name: 'HaakonASH', since: '2026-01-08', badge: 'Helper', tagline: 'New but eager' },
			{ name: 'Nollita', since: '2026-01-08', badge: 'Helper', tagline: 'Friendly helper' },
			{ name: 'TaintedBird', since: '2026-01-08', badge: 'Helper', tagline: 'Bird enthusiast' },
			{ name: 'WiscoSippi', since: '2026-01-08', badge: 'Helper', tagline: 'Sippin through life' }
		] as StaffMember[]
	};

	let selectedMember = $state<StaffMember | null>(null);
	let selectedMemberBio = $state<string | null>(null);
	let tick = $state(Date.now());

	$effect(() => {
		const id = setInterval(() => (tick = Date.now()), 1000);
		return () => clearInterval(id);
	});

	async function openModal(member: StaffMember) {
		selectedMember = member;
		selectedMemberBio = null;
		if (member.bio) {
			const bio = await loadBio(member.bio);
			if (selectedMember?.name === member.name) {
				selectedMemberBio = bio;
			}
		}
	}

	function formatStaffSince(date: string, _tick: number) {
		void _tick;
		const start = new Date(`${date}T00:00:00Z`).getTime();
		const now = Date.now();
		const diff = Math.max(0, now - start);

		const seconds = Math.floor((diff / 1000) % 60);
		const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
		const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 7);
		const weeks = Math.floor((diff / (1000 * 60 * 60 * 24 * 7)) % 4);
		const months = Math.floor((diff / (1000 * 60 * 60 * 24 * 30)) % 12);
		const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

		const parts = [];
		if (years > 0) parts.push(`${years}y`);
		if (months > 0) parts.push(`${months}mo`);
		if (weeks > 0) parts.push(`${weeks}w`);
		if (days > 0) parts.push(`${days}d`);
		if (hours > 0) parts.push(`${hours}h`);
		parts.push(`${seconds}s`);

		return parts.join(' ') || '0s';
	}

	function closeModal() {
		selectedMember = null;
		selectedMemberBio = null;
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
		class="modal-backdrop"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<article class="modal" role="document">
			<button class="modal__close" onclick={closeModal} aria-label="Close profile">✕</button>
			<section class="modal__card" aria-label="Staff profile">
				<span class="modal__badge modal__badge--{selectedMember.badge.toLowerCase()}"
					>{selectedMember.badge}</span
				>
				<div class="modal__header">
					<img
						class="modal__avatar"
						src="https://mc-heads.net/head/{selectedMember.name}"
						alt="{selectedMember.name}'s Minecraft head"
					/>
					<div class="modal__header-text">
						<h2 id="modal-title" class="modal__name">{selectedMember.name}</h2>
						{#if selectedMember.tagline}
							<p class="modal__tagline">{selectedMember.tagline}</p>
						{/if}
					</div>
				</div>

				<dl class="modal__details">
					<div class="modal__detail">
						<dt>Staff Since</dt>
						<dd>{formatStaffSince(selectedMember.since, tick)}</dd>
					</div>
					{#if selectedMember.funFact}
						<div class="modal__detail">
							<dt>Fun Fact</dt>
							<dd>{selectedMember.funFact}</dd>
						</div>
					{/if}
				</dl>

				{#if selectedMemberBio}
					<p class="modal__bio">{selectedMemberBio}</p>
				{:else if selectedMember.bio}
					<p class="modal__bio modal__bio--empty">No bio yet.</p>
				{/if}
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
		inset: 0;
		background-color: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1.5rem;
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
	}

	.modal__card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.25rem;
		min-height: 360px;
		padding: clamp(1.5rem, 4vw, 2.5rem);
		text-align: left;
	}

	.modal__header {
		display: flex;
		align-items: flex-start;
		gap: 1.25rem;
		padding-right: 2rem;
	}

	.modal__header-text {
		text-align: left;
		padding-top: 0.25rem;
	}

	.modal__badge {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.modal__badge--admin {
		background-color: rgba(34, 197, 94, 0.2);
		color: #22c55e;
	}

	.modal__badge--moderator {
		background-color: rgba(59, 130, 246, 0.2);
		color: #3b82f6;
	}

	.modal__badge--helper {
		background-color: rgba(249, 115, 22, 0.2);
		color: #f97316;
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

	.modal__avatar {
		width: 112px;
		height: 112px;
		flex-shrink: 0;
		border-radius: 14px;
		background-color: rgba(255, 255, 255, 0.04);
		border: 1px solid var(--color-border);
		padding: 0.5rem;
	}

	.modal__name {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(2rem, 5vw, 3rem);
		letter-spacing: 0.05em;
		line-height: 0.95;
		margin-bottom: 0.5rem;
	}

	.modal__tagline {
		font-size: 1.05rem;
		color: var(--color-text-muted);
	}

	.modal__details {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
		width: 100%;
	}

	.modal__detail {
		background-color: rgba(255, 255, 255, 0.035);
		border: 1px solid var(--color-border);
		border-radius: 10px;
		padding: 0.75rem 0.9rem;
	}

	.modal__detail dt {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		margin-bottom: 0.25rem;
	}

	.modal__detail dd {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.modal__bio {
		font-size: 0.95rem;
		color: var(--color-text-muted);
		line-height: 1.6;
		max-width: 620px;
		border-left: 3px solid var(--color-accent);
		padding-left: 1rem;
	}

	.modal__bio--empty {
		font-style: italic;
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
			min-height: 0;
		}

		.modal__header {
			flex-direction: column;
			padding-right: 1.5rem;
		}

		.modal__avatar {
			width: 88px;
			height: 88px;
		}

		.modal__details {
			grid-template-columns: 1fr;
		}
	}
</style>
