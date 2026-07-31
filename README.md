# 3D Restaurant Menu

A web-based restaurant menu accessible via QR code at the table. Diners land on a
warm, cinematic welcome, browse dishes in a grid, and tap any dish to view it as an
interactive 3D model — all from the browser, no app required.

- **Run locally:** `npm run dev` → http://localhost:3000
- **Design spec:** `docs/superpowers/specs/2026-06-09-3d-restaurant-menu-design.md`
- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · React Three
  Fiber + drei · Framer Motion · Vitest

## Getting started

```bash
npm install
npm run dev   # http://localhost:3000
npm test      # vitest run
```

## What's built

### Core menu browsing ✅

- **Menu (`/menu`)** — dish grid with category filter and search (`filterDishes`),
  allergen badges, and gradient dish previews.
- **Dish detail (`/dish/[id]`)** — interactive 3D viewer (React Three Fiber
  placeholder geometry mapped from each dish's `modelShape`), allergen and
  ingredient info, with not-found handling.
- **Domain layer** — `Dish` / `Ingredient` types, allergen label + colour maps,
  10 mock dishes across 5 categories, and `menuUrl` / `findDish` helpers.
- **Tested** — 38 Vitest unit tests across components, lib and pages.

### Landing experience — warm welcome pass ✅ (latest iteration)

The `/` landing was reworked into a three-section, scroll-snapped "evening
unfolding", tied together by a shared eyebrow label on each screen:

1. **The welcome** — a living 3D **morphing orb** centrepiece (drei
   `MeshDistortMaterial`, warm gold, gently breathing and turning), a "Good
   evening" greeting, and a reassurance strip: _Browse in 3D · Order at your pace
   · No app needed_.
2. **The care** — "Set at your table" with three value cards (_Locally sourced ·
   Made to order · Allergen-aware_) that rise into view on scroll.
3. **The menu** — an at-a-glance stat row derived from live menu data
   (_10 dishes · 5 categories · from $4_), a "vegan & vegetarian options" note,
   the **View Menu** CTA, and a warm sign-off.

Also landed in this pass:

- Fixed the overlay/legibility bug where the approaching-menu cards collided with
  the section copy (widened and deepened the `Scrim`).
- The shared **ambient background** (warm glow + drifting embers) now runs on all
  three sections for one cohesive atmosphere.
- The original scroll-driven "approaching menu" sweep is **paused** — kept in the
  codebase (`ApproachingMenu.tsx`), a one-line restore in `Landing.tsx`.
- Everything is **reduced-motion aware** (orb stills, reveals disable, sweep
  skipped).

## What comes next

### Ordering flow (next plan)

- `OrderContext` / cart state, `OrderDrawer`, and a `CustomizerPanel` for
  add/remove of removable ingredients.
- `/order` and `/confirmation` pages.

### 3D & visual

- Load real `.glb` dish models (currently shape-mapped placeholder geometry).
- AR "view it on your table" mode.
- Optional AI-generated molten-gold hero backdrop as an alternative to the orb —
  the prompt is ready in the `banana` skill, but needs Google AI billing enabled
  (the free tier is currently `limit: 0` for image generation).
- Decide whether to restore or retire the paused approaching-menu sweep.

### Polish & infra

- Mobile QA for the new value-card and stat rows on narrow viewports.
- Replace mock data with a real menu source.
- Exclude `.worktrees/` from the root Vitest run (it currently also scans a
  sibling git worktree). Scoped runs work today via `npx vitest run --dir src`.

## Project layout

- `src/app` — routes (`/`, `/menu`, `/dish/[id]`).
- `src/components/landing` — hero orb, ambient background, section content.
- `src/components/three` — 3D meshes.
- `src/lib`, `src/data`, `src/types` — logic, mock data, domain types.
- `docs/superpowers` — design specs and implementation plans.
