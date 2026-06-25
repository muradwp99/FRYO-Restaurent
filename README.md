# FRYO — Restaurant Website

A scroll-driven, animated marketing site for **FRYO** (burgers, wraps & pure fire),
built with Next.js. The hero is an Apple-style scroll-scrubbed burger-assembly
sequence with left/right copy that changes as you scroll, a mouse-reactive WebGL
background, a custom cursor, and a working demo cart.

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4**
- **GSAP + ScrollTrigger** — scroll-scrubbed frame sequence & text choreography
- **Lenis** — smooth scrolling (synced to ScrollTrigger)
- **Three.js** — interactive, mouse-reactive shader background in the hero
- **Framer Motion** — drawer transitions & section reveals
- **Zustand** (+ `persist`) — cart and UI (drawer) state, saved to `localStorage`
- **lucide-react** — icons
- **Bebas Neue** (display) + **Inter** (body) via `next/font`

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Features

- **Hero** (`src/components/hero/`)
  - 220-frame burger-assembly sequence drawn to a `<canvas>`, scrubbed by scroll.
  - Frame edges are feathered so the WebGL background shows through on the sides.
  - 5 "scenes": each shows a different heading (left) + subheading & body (right).
  - Frame preloader with a progress bar ("Firing up the grill…").
- **Transparent navbar** — logo left; Home / Menu / About / Table Reservation /
  Contact; **Featured** off-canvas trigger, account icon, and cart icon with a
  live item count. Goes frosted on scroll. Mobile menu included.
- **Featured drawer** (left off-canvas) — featured items with image, title,
  price and add-to-cart.
- **Cart drawer** (right) — quantities, remove, subtotal, checkout (demo).
- **Menu** — filterable (All / Burgers / Wraps) cards for all 6 items.
- **About / Reservation / Contact / Footer** — reservation form has a demo
  submit state.
- **Custom cursor** — gold dot + trailing ring that morphs and labels on hover
  (desktop / fine-pointer only).

## Brand colors (`src/app/globals.css` `@theme`)

`ink #00102b` · `navy #001840` · `royal #102A71` · `gold #F5C400` ·
`gold-light #FFDC5F` · `cream #FFFDF0`

## Asset pipeline

The raw 4K PNG frames and source video live in `_source/` and the project-root
`Hero-video_frames/` (both git-ignored). Web assets are generated into
`public/`:

```bash
node scripts/optimize-frames.mjs   # 4K PNGs -> public/frames/*.webp (1600px, ~16MB)
node scripts/crop-products.mjs     # product thumbnails -> public/products/*.webp + og.webp
```

To swap in real product photography, drop images in `public/products/` and update
the `image` paths in `src/lib/menu.ts`.

## Verify

`scripts/verify.mjs` uses Playwright to load the site, scroll the hero through
several frame states, exercise both drawers, and assert there are no runtime
errors.

```bash
npm run dev                # in one terminal
OUT_DIR=./_shots node scripts/verify.mjs
```
# FRYO-Restaurent
