<script lang="ts">
	interface Plugin {
		name: string;
		description: string;
		iconPaths: string;
		href?: string;
		hrefLabel?: string;
	}

	const plugins: Plugin[] = [
		{
			name: 'CoreProtect',
			description:
				'A high-performance data logging and anti-griefing plugin. All player actions are logged and can be viewed and rolled back by our Staff Team.',
			iconPaths: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'
		},
		{
			name: 'LuckPerms',
			description:
				'Handling all player ranks, groups and fine-grained permission nodes across our server. This is used to manage player permissions and roles.',
			iconPaths:
				'<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>'
		},
		{
			name: 'DiscordSRV',
			description:
				'Bridging our in-game chat to our Discord server, so the community can stay in sync and you dont need to load up Minecraft just to chat.',
			iconPaths: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
		},
		{
			name: 'One Player Sleep',
			description:
				'No more waiting until everyone is asleep. Sleeping in a bed now fast-forwards the night until sunrise.',
			iconPaths: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
		},
		{
			name: 'DeathDB',
			description:
				'Died to a bug? No problem, we log your inventory upon each death, making it easily recoverable.',
			iconPaths:
				'<path d="M12 2c-4 0-7 3-7 7 0 2.5 1.5 4.5 3 5.5V19h8v-4.5c1.5-1 3-3 3-5.5 0-4-3-7-7-7z"/><path d="M9 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M15 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M12 14c-1 0-2 1-2 2h4c0-1-1-2-2-2z"/>'
		},
		{
			name: 'Crafting Recipes',
			description:
				'Recipes requested by our community that make more sense, or improve the quality of life around the server.',
			iconPaths:
				'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="10.5" y="10.5" width="3" height="3" fill="currentColor"/>'
		}
	];
</script>

<section id="plugins" class="plugins-section">
	<div class="plugins-section__inner">
		<header class="plugins-section__header">
			<h2 class="plugins-section__heading">Our <span class="accent">Plugins & Datapacks</span></h2>
			<p class="plugins-section__desc">
				NearVanilla runs a carefully curated set of plugins designed to enhance your experience
				without straying from the vanilla feel. Every addition serves a clear purpose — protection,
				community, and stability.
			</p>
		</header>

		<article class="dynmap-card">
			<div class="dynmap-card__body">
				<div class="dynmap-card__icon" aria-hidden="true">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="2" y1="12" x2="22" y2="12" />
						<path
							d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
						/>
					</svg>
				</div>
				<div class="dynmap-card__content">
					<h3 class="dynmap-card__name">Dynmap</h3>
					<p class="dynmap-card__desc">
						Explore the NearVanilla world in real-time using our live browser map. Browse the
						terrain, find player-built towns, and plan your next adventure — no login required.
					</p>
				</div>
			</div>
			<a
				href="https://map.nearvanilla.com"
				class="dynmap-card__link"
				rel="noopener noreferrer"
				target="_blank"
				aria-label="Open NearVanilla live map (opens in new tab)">Open Live Map &rarr;</a
			>
		</article>

		<ul class="plugins-grid" role="list">
			{#each plugins as plugin (plugin.name)}
				<li>
					<article class="plugin-card">
						<div class="plugin-card__icon" aria-hidden="true">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html plugin.iconPaths}
							</svg>
						</div>
						<h3 class="plugin-card__name">{plugin.name}</h3>
						<p class="plugin-card__desc">{plugin.description}</p>
						{#if plugin.href}
							<a href={plugin.href} class="plugin-btn">{plugin.hrefLabel ?? 'Learn more'}</a>
						{/if}
					</article>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.plugins-section {
		background-color: var(--color-bg);
		padding: clamp(2.5rem, 5vw, 5rem) 1.5rem;
	}

	.plugins-section__inner {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.plugins-section__header {
		text-align: center;
	}

	.plugins-section__heading {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(1.5rem, 2.5vw, 2rem);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-bottom: 0.75rem;
	}

	.plugins-section__desc {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		max-width: 580px;
		margin: 0 auto;
		line-height: 1.7;
	}

	/* Featured Dynmap card */

	.dynmap-card {
		background-color: var(--color-accent);
		border-radius: 6px;
		padding: 1.75rem 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	.dynmap-card__body {
		display: flex;
		align-items: flex-start;
		gap: 1.25rem;
		flex: 1;
	}

	.dynmap-card__icon {
		width: 2.5rem;
		height: 2.5rem;
		flex-shrink: 0;
	}

	.dynmap-card__icon svg {
		width: 100%;
		height: 100%;
	}

	.dynmap-card__name {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.15rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-bottom: 0.4rem;
	}

	.dynmap-card__desc {
		font-size: 0.875rem;
		line-height: 1.65;
		opacity: 0.9;
	}

	.dynmap-card__link {
		display: inline-block;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		background-color: rgba(0, 0, 0, 0.25);
		color: var(--color-text);
		padding: 0.5rem 1.25rem;
		border-radius: 3px;
		white-space: nowrap;
		transition: background-color 0.15s ease;
	}

	.dynmap-card__link:hover {
		background-color: rgba(0, 0, 0, 0.4);
	}

	/* Plugin cards grid */

	.plugins-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.plugin-card {
		background-color: var(--color-surface-alt);
		border-radius: 6px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		height: 100%;
	}

	.plugin-card__icon {
		width: 2rem;
		height: 2rem;
		color: var(--color-accent);
		margin-bottom: 0.25rem;
	}

	.plugin-card__icon svg {
		width: 100%;
		height: 100%;
	}

	.plugin-card__name {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 0.85rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.plugin-card__desc {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		line-height: 1.65;
		flex: 1;
	}

	.plugin-btn {
		display: inline-block;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-accent);
		background-color: transparent;
		border: 1px solid var(--color-accent);
		border-radius: 3px;
		padding: 0.4rem 0.75rem;
		align-self: flex-start;
		margin-top: 0.25rem;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.plugin-btn:hover {
		background-color: var(--color-accent);
		color: var(--color-text);
	}

	@media (max-width: 900px) {
		.dynmap-card {
			flex-direction: column;
			align-items: flex-start;
		}

		.dynmap-card__link {
			align-self: flex-start;
		}
	}

	@media (max-width: 768px) {
		.plugins-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.plugins-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
