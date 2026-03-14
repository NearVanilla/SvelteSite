# Svelte Website Audit Report

## Summary

This audit analyzed the NearVanilla SvelteKit website codebase across 12 categories. The project is in a reasonably healthy state with proper Svelte 5 runes usage, good semantic HTML structure, and responsive design. However, several issues require attention, particularly around SEO, accessibility, security, and project completeness.

| Category                        | Issues Found |
| ------------------------------- | ------------ |
| Bugs & Errors                   | 3            |
| Svelte-Specific Best Practices  | 3            |
| Reactivity & State Management   | 0            |
| Performance Optimisation        | 2            |
| SvelteKit Structure             | 3            |
| HTML Structure & Semantics      | 1            |
| Accessibility (a11y)            | 3            |
| CSS & Styling                   | 0            |
| SEO                             | 5            |
| Security                        | 3            |
| JavaScript & TypeScript Quality | 1            |
| File & Project Structure        | 3            |

**Priority Rating: Medium** — The codebase is production-ready for a static informational site, but several quality-of-life improvements and missing features should be addressed before broader deployment.

---

## Issues by Category

### 1. Bugs & Errors

#### 🔴 Critical — Missing Route Pages

- **File:** `src/lib/components/Nav.svelte` (lines 2-7)
- **Problem:** The navigation links to `/server`, `/players`, `/map`, and `/other`, but no corresponding route files exist in `src/routes/`. Clicking these links results in 404 errors.
- **Fix:** Either create the missing route pages or remove the dead navigation links.

```svelte
// Current (dead links)
const navLinks = [
  { label: 'Server', href: '/server' },
  { label: 'Players', href: '/players' },
  { label: 'Map', href: '/map' },
  { label: 'Other', href: '/other' }
];
```

#### 🔴 Critical — Missing Apply Anchor Target

- **Files:** `src/lib/components/Nav.svelte` (line 22), `src/lib/components/Hero.svelte` (line 15)
- **Problem:** Both the "Apply Now" CTA and "Join the Server" button link to `#apply`, but no element with `id="apply"` exists on the page. Clicking these links scrolls to the top of the page with no action.
- **Fix:** Either create an application section with `id="apply"` or change the links to point to a valid destination (e.g., a Discord invite or application form).

```svelte
<!-- In Nav.svelte and Hero.svelte -->
<a href="#apply" class="...">Apply Now</a>
<!-- No element with id="apply" exists -->
```

#### 🟠 High — Docker Healthcheck Port Mismatch

- **File:** `docker-compose.yml` (line 10)
- **Problem:** The healthcheck tests port 80, but the Dockerfile exposes port 8000. This causes the healthcheck to always fail.
- **Fix:** Update the healthcheck to use port 8000:

```yaml
# Before
test: ["CMD", "wget", "--spider", "-q", "http://localhost:80"]

# After
test: ["CMD", "wget", "--spider", "-q", "http://localhost:8000"]
```

---

### 2. Svelte-Specific Best Practices

#### 🟡 Medium — Use of {@html} with Hardcoded Data

- **File:** `src/lib/components/PluginsSection.svelte` (line 109)
- **Problem:** The component uses `{@html}` to render SVG paths from the `plugin.iconPaths` property. While currently safe because the data is hardcoded, this pattern is flagged by ESLint and could become a security risk if plugin data ever comes from an external source.
- **Fix:** Consider using dedicated SVG components or a safer icon system. If keeping `{@html}`, document why this is safe and add a comment explaining the data source is trusted.

```svelte
<!-- Current -->
{@html plugin.iconPaths}

<!-- Alternative: Use a dedicated Icon component -->
<Icon name={plugin.iconName} />
```

#### 🟡 Medium — External Links Without Security Attributes

- **Files:** `src/lib/components/Hero.svelte` (line 16), `src/lib/components/PluginsSection.svelte` (line 91)
- **Problem:** External links to `https://map.nearvanilla.com` are missing `rel="noopener noreferrer"`, which is a security best practice for external links.
- **Fix:** Add the security attributes to external links:

```svelte
<!-- Before -->
<a href="https://map.nearvanilla.com" class="hero__secondary">View Live Map</a>

<!-- After -->
<a
	href="https://map.nearvanilla.com"
	class="hero__secondary"
	rel="noopener noreferrer"
	target="_blank">View Live Map</a
>
```

#### 🟡 Medium — Non-Descriptive Link Text

- **Files:** `src/lib/components/Hero.svelte` (line 16), `src/lib/components/PluginsSection.svelte` (line 91)
- **Problem:** The link text "View Live Map" and "Open Live Map" could be more descriptive for screen readers. Additionally, when opening in a new tab, users should be notified.
- **Fix:** Add accessible link text and consider adding visually hidden text:

```svelte
<a
	href="..."
	rel="noopener noreferrer"
	target="_blank"
	aria-label="View NearVanilla live map (opens in new tab)"
>
	View Live Map
	<span class="visually-hidden"> (opens in new tab)</span>
</a>
```

---

### 3. Reactivity & State Management

No issues found. The codebase properly uses Svelte 5 runes and has no improper store subscriptions or reactivity problems.

---

### 4. Performance Optimisation

#### 🟡 Medium — Render-Blocking Font Loading

- **File:** `src/app.css` (line 1)
- **Problem:** Google Fonts are loaded via `@import` in CSS, which blocks rendering until the font file is fetched. This causes a flash of unstyled text (FOUT) or invisible text (FOIT).
- **Fix:** Move the font loading to `app.html` with `preconnect` hints for faster loading:

```html
<!-- In app.html, replace the CSS @import with: -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
	href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@400;500;600&display=swap"
	rel="stylesheet"
/>

<!-- Then remove from app.css: -->
/* @import url('https://fonts.googleapis.com/css2?family=...'); */
```

#### 🟡 Medium — Gallery Images Not Lazy Loaded

- **File:** `src/lib/components/Gallery.svelte` (line 36, 46)
- **Problem:** Gallery images use `loading="eager"` instead of lazy loading. While these are decorative and part of an infinite scroll animation, they could impact initial page load performance.
- **Fix:** Consider loading only the first batch eagerly and lazy loading the rest, or accept the current behavior since the gallery is below the fold and the animation requires immediate availability.

```svelte
<!-- Current -->
<img src={img.src} alt={img.alt} class="gallery__img" loading="eager" />

<!-- Alternative: Lazy load non-visible images -->
<img src={img.src} alt={img.alt} class="gallery__img" loading="lazy" />
```

---

### 5. SvelteKit Structure

#### 🟠 High — Only One Route Exists

- **File:** `src/routes/`
- **Problem:** The site has only one route (`/`). The navigation suggests multiple pages should exist (`/server`, `/players`, `/map`, `/other`), but no route files exist for them.
- **Fix:** Either create the missing route pages or consolidate the navigation to only include existing routes.

#### 🟡 Medium — No +error.svelte Page

- **File:** `src/routes/`
- **Problem:** No error page exists to handle 404s or other HTTP errors gracefully.
- **Fix:** Create `src/routes/+error.svelte` to provide a custom error page:

```svelte
<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.status === 404}
	<h1>Page not found</h1>
	<p>The page you're looking for doesn't exist.</p>
{:else}
	<h1>Something went wrong</h1>
	<p>Error: {$page.error?.message}</p>
{/if}
```

#### 🟡 Medium — No +layout.svelte for Additional Routes

- **File:** `src/routes/+layout.svelte`
- **Problem:** The root layout is minimal. Consider whether nested routes need additional layout elements (sidebars, breadcrumbs, etc.).
- **Fix:** No action needed if the current single-page design is intentional. Document the intended route structure.

---

### 6. HTML Structure & Semantics

#### 🟢 Low — Missing `<main>` Element Wrapper Consistency

- **File:** `src/routes/+page.svelte` (line 11)
- **Problem:** The page uses `<main>` correctly, but the layout doesn't include a footer. Consider adding semantic footer content.
- **Fix:** Add a `<footer>` element in the layout or page for completeness:

```svelte
<!-- In +layout.svelte -->
<footer class="site-footer">
	<p>&copy; 2026 NearVanilla. All rights reserved.</p>
</footer>
```

---

### 7. Accessibility (a11y)

#### 🟠 High — Missing Page Titles

- **Files:** All route pages
- **Problem:** No `<svelte:head>` block sets page titles or meta descriptions. Each route should have unique, descriptive titles for accessibility and SEO.
- **Fix:** Add `<svelte:head>` to each route:

```svelte
<!-- In +page.svelte -->
<svelte:head>
	<title>NearVanilla — Semi-Vanilla Minecraft Survival Server</title>
	<meta
		name="description"
		content="Join NearVanilla, a semi-vanilla Minecraft survival server focused on community, creativity, and the pure Minecraft experience."
	/>
</svelte:head>
```

#### 🟡 Medium — External Links Don't Indicate New Tab

- **Files:** `src/lib/components/Hero.svelte`, `src/lib/components/PluginsSection.svelte`
- **Problem:** Links that open in new tabs don't visually indicate this to users.
- **Fix:** Add visual indicator or `aria-label`:

```svelte
<a
	href="..."
	target="_blank"
	rel="noopener noreferrer"
	aria-label="View live map (opens in new tab)"
>
	View Live Map
	<svg aria-hidden="true" class="external-icon">...</svg>
</a>
```

#### 🟡 Medium — Missing Skip Link for Keyboard Navigation

- **File:** `src/routes/+layout.svelte`
- **Problem:** No skip-to-content link exists for keyboard users to bypass navigation.
- **Fix:** Add a skip link in the layout:

```svelte
<a href="#main-content" class="skip-link">Skip to main content</a>

<style>
	.skip-link {
		position: absolute;
		top: -40px;
		left: 0;
		background: var(--color-accent);
		color: white;
		padding: 8px;
		z-index: 1000;
	}
	.skip-link:focus {
		top: 0;
	}
</style>
```

---

### 8. CSS & Styling

No issues found. The CSS is well-structured with proper use of CSS custom properties, responsive breakpoints, and scoped styles.

---

### 9. SEO

#### 🟠 High — Missing Title and Meta Description

- **File:** All route pages
- **Problem:** No `<svelte:head>` blocks exist with page titles or meta descriptions. This severely impacts search engine visibility.
- **Fix:** Add comprehensive metadata to each route:

```svelte
<svelte:head>
	<title>NearVanilla — Semi-Vanilla Minecraft Survival Server</title>
	<meta
		name="description"
		content="Join NearVanilla, a semi-vanilla Minecraft survival server designed to stay close to the original experience while providing a welcoming community."
	/>
	<meta property="og:title" content="NearVanilla — Semi-Vanilla Minecraft Server" />
	<meta property="og:description" content="A community-focused Minecraft survival server." />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
```

#### 🟡 Medium — Missing Open Graph Tags

- **File:** All route pages
- **Problem:** No Open Graph or Twitter Card meta tags exist for social media sharing.
- **Fix:** Add OG and Twitter Card tags (see above).

#### 🟡 Medium — No Canonical URLs

- **File:** All route pages
- **Problem:** No canonical URL tags, which can cause duplicate content issues.
- **Fix:** Add canonical URLs:

```svelte
<svelte:head>
	<link rel="canonical" href="https://nearvanilla.com/" />
</svelte:head>
```

#### 🟡 Medium — No robots.txt or sitemap

- **File:** `src/routes/` (or static/)
- **Problem:** No `robots.txt` or sitemap.xml exists for search engine crawling.
- **Fix:** Create `src/routes/robots.txt` and optionally `src/routes/sitemap.xml`:

```txt
# src/routes/robots.txt
User-agent: *
Allow: /
Sitemap: https://nearvanilla.com/sitemap.xml
```

#### 🟢 Low — Non-Descriptive Link Text

- **Files:** Navigation and button links
- **Problem:** Links like "Apply Now" are acceptable but could be more descriptive.
- **Fix:** Already noted in Svelte-Specific Best Practices section.

---

### 10. Security

#### 🟡 Medium — External Links Missing rel="noopener noreferrer"

- **Files:** `src/lib/components/Hero.svelte`, `src/lib/components/PluginsSection.svelte`
- **Problem:** External links lack security attributes.
- **Fix:** Add security attributes to all external links:

```svelte
<a href="https://map.nearvanilla.com" rel="noopener noreferrer" target="_blank">...</a>
```

#### 🟡 Medium — {@html} with Potentially Unsafe Content

- **File:** `src/lib/components/PluginsSection.svelte`
- **Problem:** Using `{@html}` with plugin.iconPaths, even though currently hardcoded.
- **Fix:** Already noted in Svelte-Specific Best Practices. Keep if intentionally trusted, otherwise migrate to component-based icons.

#### 🟢 Low — Google Fonts Loaded Over HTTPS

- **File:** `src/app.css`
- **Problem:** Fonts are loaded from Google Fonts (HTTPS is fine, but consider self-hosting for privacy).
- **Fix:** No critical action needed. For enhanced privacy, consider self-hosting fonts.

---

### 11. JavaScript & TypeScript Quality

#### 🟢 Low — Formatting Issue in docker-compose.yml

- **File:** `docker-compose.yml`
- **Problem:** Prettier reports formatting issues with this file.
- **Fix:** Run `bun run format` or manually format the file to match project standards.

---

### 12. File & Project Structure

#### 🟡 Medium — Empty $lib Barrel File

- **File:** `src/lib/index.ts`
- **Problem:** The barrel file is empty. Components are imported directly from their paths rather than through the barrel.
- **Fix:** Export components from the barrel for cleaner imports:

```typescript
// src/lib/index.ts
export { default as Nav } from './components/Nav.svelte';
export { default as Hero } from './components/Hero.svelte';
export { default as InfoSection } from './components/InfoSection.svelte';
export { default as Gallery } from './components/Gallery.svelte';
export { default as PluginsSection } from './components/PluginsSection.svelte';
export { default as SpecsSection } from './components/SpecsSection.svelte';
export { default as SpecCard } from './components/SpecCard.svelte';
```

Then use: `import { Nav, Hero } from '$lib';`

#### 🟢 Low — No README or Documentation

- **File:** Root directory
- **Problem:** The README.md is the default SvelteKit template, not customized for NearVanilla.
- **Fix:** Create a project-specific README with setup instructions, project structure, and deployment information.

#### 🟢 Low — Inconsistent Component Organization

- **File:** `src/lib/`
- **Problem:** All components are flat in `components/`. Consider organizing by feature if the project grows.
- **Fix:** No action needed for current project size. Document this as a consideration for future scaling.

---

## Quick Wins

The following fixes have the highest immediate impact with minimal effort:

1. **Add page titles and meta descriptions** — Critical for SEO and accessibility. Add `<svelte:head>` to `+page.svelte`.

2. **Fix Docker healthcheck port** — Change port 80 to 8000 in `docker-compose.yml`.

3. **Add `rel="noopener noreferrer"` to external links** — Security best practice for `Hero.svelte` and `PluginsSection.svelte`.

4. **Create the #apply anchor or remove dead links** — Either add an application section or update navigation links.

5. **Fix docker-compose.yml formatting** — Run `bun run format`.

6. **Create missing route pages or remove navigation links** — Decide on site structure and implement.

7. **Add Open Graph and Twitter Card tags** — Improve social media sharing visibility.

---

## Recommended Next Steps

### Phase 1: Critical Fixes (Immediate)

1. Add `<svelte:head>` with title and meta description to the home page
2. Fix Docker healthcheck port mismatch
3. Fix or remove the `#apply` anchor links
4. Add `rel="noopener noreferrer"` to external links

### Phase 2: SEO & Accessibility (This Week)

5. Add Open Graph and Twitter Card meta tags
6. Create `robots.txt` and sitemap
7. Add skip-to-content link for keyboard navigation
8. Create error page (`+error.svelte`)

### Phase 3: Code Quality (This Sprint)

9. Populate the `$lib` barrel with exports
10. Migrate Google Fonts to `app.html` with preconnect
11. Decide on route structure and implement missing pages
12. Update README with project-specific documentation

### Phase 4: Future Considerations

- Consider self-hosting fonts for privacy
- Add unit tests for components
- Implement the missing navigation pages
- Add a blog or news section for content updates

---

## Conclusion

The NearVanilla website codebase is well-structured and follows Svelte 5 best practices. The main gaps are in SEO, accessibility, and project completeness. Addressing the critical items in Phase 1 will significantly improve the site's search visibility and user experience. The codebase is production-ready for a static informational site once the critical issues are resolved.
