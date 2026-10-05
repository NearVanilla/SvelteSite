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

## Superpowers

If the Superpowers skill library is available in your environment, use it.

### `using-superpowers`

**When**: At the start of every conversation, before any other response or action — including clarifying questions, exploring the codebase, or reading files.

Invoke the `using-superpowers` skill (`superpowers:using-superpowers` in Claude Code) through your harness's skill mechanism. It explains how to find and invoke the other Superpowers skills, such as `brainstorming`, `systematic-debugging`, `writing-plans`, and `verification-before-completion`. Follow it exactly.

If Superpowers is not installed or your harness does not support skills, skip this section.

**Precedence**: The instructions in this file and direct user requests take precedence over Superpowers skills. Where they conflict (for example, the MCP Tools workflow above), follow this file.
