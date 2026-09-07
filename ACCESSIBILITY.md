# Accessibility Standards

NutriFlow is designed to be usable by everyone. We adhere to the WCAG 2.1 AA standards where possible.

## Key Implementation Details

### 1. Semantic HTML
- We use semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`) to provide structure for screen readers.

### 2. ARIA Attributes
- Interactive elements that are not standard HTML inputs use appropriate `aria-` attributes (e.g., `aria-hidden="true"` on decorative icons, `aria-label` on icon-only buttons).
- Dynamic state changes (like form errors or loading states) are communicated using `aria-live`.

### 3. Keyboard Navigation
- All interactive elements are fully focusable and usable via keyboard (`Tab`, `Space`, `Enter`).
- The application includes a `Skip to content` link (SkipNav) to bypass the main navigation.

### 4. Color Contrast
- Our custom brand palette (Brand Green, Brand Cream, Text Primary/Secondary) was tested to ensure sufficient color contrast ratios.
- Focus rings are highly visible (`ring-2 ring-brand-green`).

## Ongoing Review
Accessibility is an ongoing process. As new features are built, they must be manually tested with keyboard navigation and automated tools (like Axe).
