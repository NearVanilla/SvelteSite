<script lang="ts">
	import StaffProfileDialog from '$lib/components/StaffProfileDialog.svelte';
	import { staffTiers, type StaffMember, type StaffRole } from '$lib/data/staff';

	let selected = $state<{ member: StaffMember; role: StaffRole } | null>(null);
	let opener: HTMLButtonElement | null = null;

	function openProfile(member: StaffMember, role: StaffRole, button: HTMLButtonElement) {
		opener = button;
		selected = { member, role };
	}

	function closeProfile() {
		selected = null;
		if (opener?.isConnected) opener.focus();
		opener = null;
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
		{#each staffTiers as tier (tier.role)}
			<section class="staff-tier">
				<h2 class="staff-tier__title staff-tier__title--{tier.role}">{tier.label}</h2>
				<ul class="staff-list" role="list">
					{#each tier.members as member (member.name)}
						<li>
							<button
								class="staff-card"
								onclick={(event) => openProfile(member, tier.role, event.currentTarget)}
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
			</section>
		{/each}
	</div>
</section>

{#if selected}
	<StaffProfileDialog member={selected.member} role={selected.role} onclose={closeProfile} />
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

	@media (max-width: 600px) {
		.staff-list {
			grid-template-columns: 1fr;
		}
	}
</style>
