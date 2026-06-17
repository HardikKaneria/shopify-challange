# Best Sellers Product Carousel

A "Best Sellers" product section built from a Figma reference: a heading row with a "Shop All" link, 10 product cards with hover image swap, star ratings, sale badges, and a horizontally scrolling carousel with a custom scrollbar. Built twice — once as static HTML/Tailwind/vanilla JS, and once as a Shopify Liquid section with fully editable theme-editor blocks.

## Preview

Open `index.html` directly in a browser — no build step required, the CSS is precompiled to `dist/output.css`.

## Features

- 10 product cards, each with a primary image, hover-swap secondary image, title, star rating, review count, sale badge, and price
- Desktop: horizontal scroll carousel with a custom draggable scrollbar (thumb grows on hover/touch, click-to-scroll, drag-to-scroll)
- First product card never gets clipped; the carousel "peeks" the next card past the section's max width
- Mobile: 2-column grid, first 4 products shown, "Show More" reveals the rest with a staggered animation
- Accessible: semantic headings, `aria-label`/`aria-expanded`/`aria-hidden` where appropriate, focus-visible states, respects `prefers-reduced-motion`
- Vanilla JS only — no frameworks, no jQuery

## Tech Stack

- Semantic HTML
- Tailwind CSS v4 (CLI build, not the Play CDN)
- Vanilla JavaScript
- Shopify Liquid (bonus section, see below)

## Project Structure

```
index.html                 Static demo page (open this in a browser)
js/main.js                 Carousel, scrollbar, hover-swap, Show More logic
src/input.css              Tailwind source for the static demo
dist/output.css            Compiled CSS used by index.html (precompiled, committed)

shopify-theme/
  sections/
    best-sellers-carousel.liquid   The Shopify section, with editable blocks
  assets/
    best-sellers.css               Compiled CSS for the section
    best-sellers.js                Carousel/scrollbar/hover-swap logic for Shopify
  templates/index.json             Wires the section + its default product blocks into the homepage
  config/settings_data.json        Page-width settings aligned to the section's 1664px max width
src/input.shopify.css      Tailwind source for the Shopify section's compiled CSS
```

## Shopify Section (Bonus)

The carousel was also rebuilt as a Shopify theme section (`shopify-theme/sections/best-sellers-carousel.liquid`). Each product card is a **block** in the section schema, so every field is editable from the theme editor without touching code:

- Image and hover image (image picker)
- Title
- Rating (0–5, half-star steps)
- Sale badge (None / 10% / 15% / 20% / 25%)
- Price

Merchants can add, remove, and reorder product blocks from the customizer. The section is self-contained — scoped IDs (`{{ section.id }}`), multi-instance safe JS (`shopify:section:load`), and its own compiled CSS/JS assets.

### Building the Shopify CSS

```
npm run build:shopify
```

Compiles `src/input.shopify.css` → `shopify-theme/assets/best-sellers.css` and unwraps Tailwind's CSS cascade layers so the theme's own unlayered CSS doesn't silently override the section's utility classes.

## Scripts

| Command | Description |
| --- | --- |
| `npm run build` | Compile the static demo's Tailwind CSS to `dist/output.css` |
| `npm run watch` | Watch and rebuild the static demo's CSS |
| `npm run build:shopify` | Compile and post-process the Shopify section's CSS |
| `npm run watch:shopify` | Watch and rebuild the Shopify section's CSS |

## Notes

- Product images are placeholders from Unsplash; the Shopify section falls back to these until a merchant picks their own images in the theme editor.
- The static demo and the Shopify section share the same design but have independent CSS/JS builds, since the Shopify section runs inside a full theme (global header/footer, page-width settings, etc.) rather than standalone.
