# NearVanilla website

Community information, staff profiles and world downloads, built with Svelte 5, SvelteKit 2 and TypeScript. Bun manages dependencies and scripts.

## Development

```sh
bun install --frozen-lockfile
bun run dev
```

## Quality checks

```sh
bun run check
bun run lint
bun run build
```

Use `bun run format` to apply the repository's tab, quote and LF formatting conventions. Internal route and fragment failures stop prerendering.

## Static deployment

`adapter-static` prerenders `/`, `/staff` and `/downloads` into `build/`. There is no runtime application server or SPA fallback. The site is hosted at the domain root.

`bun run preview` previews the build locally, but does not verify Nginx routing. The container's `nginx.conf` resolves extensionless routes to their generated `.html` files and returns HTTP 404 for unknown routes and missing assets.

```sh
docker build -t nearvanilla-site .
docker run --rm -p 8080:80 nearvanilla-site
```

Alternatively, `docker compose up --build -d` starts the configured service on port 80 with its healthcheck and restart policy. Use `docker compose down` to stop that deployment.

## Crawler policy

`static/robots.txt` requests that all crawlers, including search engines, avoid the entire site. The build publishes it at `/robots.txt`. Robots directives are advisory; they are not authentication or access control.
