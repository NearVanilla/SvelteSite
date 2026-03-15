# Rule: Write Custom Vanilla CSS

**Description:**
All styling must be written using custom, vanilla CSS. Do not use any CSS frameworks, utility-class libraries (like Tailwind CSS, Bootstrap, etc.), or inline styles unless explicitly instructed otherwise. 

## Guidelines
* **No CSS Frameworks:** Absolutely no Tailwind CSS classes or Bootstrap classes.
* **Semantic Class Names:** Write descriptive, semantic class names that describe the component, not its visual appearance. Using the BEM (Block Element Modifier) naming convention is highly encouraged.
* **Use Modern CSS:** Utilize modern CSS features like CSS Custom Properties (variables), Flexbox, CSS Grid, and modern pseudo-selectors.
* **Separation of Concerns:** Keep CSS in separate `.css` files or within `<style>` blocks if using single-file components. Avoid inline `style="..."` attributes entirely.
* **Responsive Design:** Write custom media queries to handle responsiveness rather than relying on framework breakpoints.

## Examples

### ✅ DO: Custom CSS with semantic class names
```html
<button class="primary-btn primary-btn--large">Submit</button>

<style>
  :root {
    --color-primary: #007bff;
    --radius-md: 4px;
  }

  .primary-btn {
    background-color: var(--color-primary);
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .primary-btn--large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
</style>
```

### ❌ DON'T: Utility classes (Tailwind) or inline styles
```html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Submit
</button>

<button style="background-color: blue; color: white; padding: 10px;">
  Submit
</button>
```