# Rule: Enforce Strict Semantic HTML

**Description:**
All HTML generated, modified, or suggested must use the most appropriate semantic HTML5 elements. Never use non-semantic elements (like `<div>` or `<span>`) when a semantic alternative exists.

## Guidelines

- **Analyze before tagging:** Understand the content's meaning and structure before choosing a tag. Structure the page logically using landmark elements (e.g., `<main>`, `<header>`, `<footer>`, `<nav>`, `<aside>`).
- **Use `<div>` and `<span>` as a last resort:** Only use these for styling or grouping when absolutely no semantic element applies.
- **Semantic over visual:** Do not use HTML elements purely for visual formatting (e.g., never use `<br>` for margins/padding, and do not use `<h1>` to make text big if it isn't the primary page heading).
- **Native interactive elements:** Always use native interactive tags (`<button>`, `<a>`, `<dialog>`, `<details>`) instead of adding JavaScript and ARIA roles to a non-interactive element like a `<div>`.

## Examples

### ✅ DO: Proper page structure and native forms

```html
<header>...</header>
<nav>...</nav>
<main>
	<article>
		<header><h2>Article Title</h2></header>
		<p>Content goes here.</p>
		<figure>
			<img src="img.jpg" alt="Description of image" />
			<figcaption>Caption</figcaption>
		</figure>
	</article>
</main>
<footer>...</footer>

<form>
	<fieldset>
		<legend>Personal Info</legend>
		<label for="name">Name:</label>
		<input type="text" id="name" name="name" />
	</fieldset>
	<button type="submit">Submit</button>
</form>
```
