import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn',
			// Stats routes have no entries when STATS_DIR isn't set (empty-state build).
			handleUnseenRoutes: 'warn'
		}
	}
};

export default config;
