<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="footer__inner">
		<p class="footer__copy">
			&copy; {currentYear} NearVanilla. Not affiliated with Mojang or Microsoft.
		</p>
		<nav class="footer__links" aria-label="Footer navigation">
			<a
				href="https://discord.com/invite/KHAuj5F"
				class="footer__link"
				target="_blank"
				rel="noopener"
			>
				Discord
			</a>
		</nav>
	</div>
</footer>

<style>
	.footer {
		background-color: var(--color-surface);
		border-top: 1px solid var(--color-border);
		padding: 1.5rem;
	}

	.footer__inner {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	@media (min-width: 640px) {
		.footer__inner {
			flex-direction: row;
			justify-content: space-between;
		}
	}

	.footer__copy {
		font-size: 0.8rem;
		color: var(--color-text-muted);
	}

	.footer__links {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.footer__link {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		transition: color 0.15s ease;
	}

	.footer__link:hover {
		color: var(--color-accent);
	}

	.footer__divider {
		color: var(--color-border);
		font-size: 0.8rem;
	}
</style>
