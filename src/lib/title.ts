export const SITE_NAME = 'NearVanilla SMP';

/** Builds a document title in the site-wide `NearVanilla SMP - <page>` format. */
export function pageTitle(page?: string): string {
	return page ? `${SITE_NAME} - ${page}` : SITE_NAME;
}
