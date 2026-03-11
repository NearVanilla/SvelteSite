# NearVanilla Site — Agent Guide

This is the NearVanilla community website: a hub for Minecraft server info, joining instructions, community guidelines, and player resources. The project is an **early-stage SvelteKit scaffold** — the infrastructure is fully configured but no NearVanilla-specific page content has been built yet.

---

## Project Configuration

| Setting          | Value                     |
| ---------------- | ------------------------- |
| Language         | TypeScript (strict)       |
| Package Manager  | bun                       |
| Framework        | SvelteKit 2 + Svelte 5    |
| Add-ons          | Prettier, ESLint, MCP     |

---

## Tech Stack & Versions

These versions directly affect how you should write code:

- **Svelte `^5.51.0`** — runes API only (`$state`, `$derived`, `$effect`, `$props`). Never use legacy syntax: no `export let`, no `$:` reactive statements, no `beforeUpdate`/`afterUpdate`.
- **SvelteKit `^2.50.2`** — file-based routing, `adapter-auto` deployment target.
- **TypeScript `^5.9.3`** — `strict: true`, `moduleResolution: "bundler"`.
- **Vite `^7.3.1`** — minimal config, SvelteKit plugin only.
- No runtime `dependencies` — all packages are `devDependencies`.

---

## Project Structure

```
src/
├── app.html              # HTML shell (%sveltekit.head%, %sveltekit.body%)
├── app.d.ts              # SvelteKit global type stubs (App namespace)
├── lib/
│   └── index.ts          # $lib barrel — currently empty
└── routes/
    ├── +layout.svelte    # Root layout — imports favicon, renders <slot />
    └── +page.svelte      # Home page — placeholder content only
```

**Known gap:** `+layout.svelte` imports `$lib/assets/favicon.svg`, but that file does not exist yet. Add it before running a production build.

New routes go under `src/routes/`. Shared utilities and components belong in `src/lib/`.

---

## Common Commands

| Command            | Purpose                          |
| ------------------ | -------------------------------- |
| `bun run dev`      | Start dev server                 |
| `bun run build`    | Production build                 |
| `bun run preview`  | Preview production build locally |
| `bun run check`    | TypeScript + Svelte type check   |
| `bun run lint`     | Prettier + ESLint (check only)   |
| `bun run format`   | Auto-format all files            |

Always run `bun run check` and `bun run lint` after making changes.

---

## Code Conventions

- **Indentation**: tabs (not spaces)
- **Quotes**: single quotes
- **Trailing commas**: none
- **Line width**: 100 characters
- **Semantic HTML**: always use `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` over bare `<div>`/`<span>` wrappers
- **Svelte 5 runes only**: use `$state()`, `$derived()`, `$effect()`, `$props()` — never legacy Options API

---

## MCP Tools

The Svelte MCP server (`https://mcp.svelte.dev/mcp`) provides four tools. Follow this decision logic exactly:

### 1. `list-sections`

**When**: At the start of any task that involves Svelte or SvelteKit code — always call this first.

Returns all available documentation sections with `title`, `use_cases`, and `path`. Use the `use_cases` field to determine which sections are relevant before fetching content.

### 2. `get-documentation`

**When**: Immediately after `list-sections`. Accepts single or multiple section paths.

Fetch ALL sections relevant to the task — do not guess at APIs from training data when documentation is available.

### 3. `svelte-autofixer`

**When**: After writing or editing any `.svelte` file.

Analyzes the code and returns issues and suggestions. Re-run until it returns zero issues before presenting the code to the user.

### 4. `playground-link`

**When**: Only after the user explicitly confirms they want a playground link.

Generates a shareable Svelte Playground URL. **Never call this if the code has already been written to files in the project.**

---

## Key Files Reference

| File                          | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| `svelte.config.js`            | SvelteKit adapter config                 |
| `vite.config.ts`              | Vite plugin config                       |
| `tsconfig.json`               | Extends `.svelte-kit/tsconfig.json`      |
| `eslint.config.js`            | ESLint flat config with Svelte plugin    |
| `.prettierrc`                 | Formatting rules                         |
