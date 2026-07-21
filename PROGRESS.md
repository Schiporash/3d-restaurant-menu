# Progress & Handoff — 3D Restaurant Menu

_Last updated: 2026-07-21. Branch: `3d-menu-browsing`._

This file tracks what is **done** and what is **left to do**, so anyone (or a fresh AI session)
can pick the work up without re-deriving context.

---

## ✅ Done — Frontend v1 (browsing, mock data)

The full "3D Menu Browsing" plan is implemented and all tests pass.

- **Scaffold:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Vitest + React Testing Library.
- **Domain:** `src/types/menu.ts` (Dish, categories, allergen tags, model shapes),
  `src/lib/allergens.ts` (labels + colors), `src/data/mockMenu.ts` (10 dishes).
- **Components:** `AllergenBadge`, `CategoryFilter`, `DishCard`, `Viewer3D` (R3F placeholder
  geometry mapped from each dish's `modelShape`).
- **Pages:** `/` → redirects to `/menu?table=N`; `/menu` (grid + category filter + search);
  `/dish/[id]` (3D viewer + allergen info) with a `not-found` screen.
- **Tests:** 27 passing (`npm test`). Build passes (`npm run build`).
- **Dependency fix:** upgraded to **React 19 + @react-three/fiber v9 + @react-three/drei v10**
  because R3F v8 crashed under Next.js 15's bundled React 19
  (`Cannot read properties of undefined (reading 'ReactCurrentOwner')`).
  Install with `npm install --legacy-peer-deps`.

Plan: `docs/superpowers/plans/2026-06-13-3d-menu-browsing.md`
Design: `docs/superpowers/specs/2026-06-09-3d-restaurant-menu-design.md`

---

## ✅ Done — Warm & Elegant Redesign

A full visual + motion redesign: warm/cozy + fine-dining aesthetic with smooth Framer Motion
animations and lazy 3D previews on dish cards. **Implemented — 31 tests pass, build passes.**

- **Spec:** `docs/superpowers/specs/2026-06-21-warm-elegant-redesign-design.md`
- **Plan (12 bite-sized, TDD tasks):** `docs/superpowers/plans/2026-06-21-warm-elegant-redesign.md`

### Task checklist (all complete)

- [x] **T1** — Install `framer-motion`
- [x] **T2** — Warm design tokens + background glow + serif/sans fonts (`globals.css`, `layout.tsx`)
- [x] **T3** — Extract shared `three/DishMesh.tsx`; warm `Viewer3D` lighting + auto-rotate
- [x] **T4** — Motion primitives: `FadeIn`, `StaggerGrid` (with `prefers-reduced-motion`)
- [x] **T5** — `lib/orbGradient.ts` helper (TDD)
- [x] **T6** — `DishCardPreview` (gradient orb + lazy 3D via IntersectionObserver/hover)
- [x] **T7** — `CategoryFilter` warm pills + animated sliding underline (`layoutId`)
- [x] **T8** — Warm-toned `AllergenBadge` colors
- [x] **T9** — `DishCard` warm styling + preview + hover lift
- [x] **T10** — Menu page stagger grid + warm search input
- [x] **T11** — Dish detail page + not-found warm polish
- [x] **T12** — Full verification (31 tests + build pass)

_Note: framer-motion v12 needed cubic-bezier easing typed as a tuple; test files that render
dish cards stub `IntersectionObserver` (absent in jsdom)._

## ✅ Done — Ambient Landing Page

A scroll-snap "showroom" landing at `/` (hero + experience + CTA), ambient CSS glow and
embers, a lazy-loaded 3D centrepiece, and SVG line art that draws on scroll. `/` no longer
auto-redirects to the menu. **38 tests pass, build passes.**

Details, decisions and follow-ups: `docs/LANDING.md`

## 🚧 What's left to do (roadmap)

Suggested order, highest value first. Each item should get its own brainstorm → spec → plan
cycle before coding.

### 1. Dish-level polish (direct follow-on from the landing work)
- [ ] Mouse-parallax tilt on `DishCard` — the one technique from the reference site not yet
  applied.
- [ ] Loading skeletons for the menu grid.

### 2. Real 3D models — the big visual unlock
Every 3D object in the app (dish previews, dish viewer, hero centrepiece) is still
placeholder procedural geometry from `three/DishMesh.tsx` — elegant, but it doesn't
look like food. See `docs/LANDING.md` for the capture-vs-generate trade-off.
- [ ] Add a `modelUrl` field to `Dish` and a loading fallback
- [ ] Load real `.glb` models via `useGLTF` (drei), or a splat renderer if using scans

### 3. Cart & Ordering flow (was explicitly out of scope for v1)
- [ ] `OrderContext` (add/remove items, quantities, running total)
- [ ] `CustomizerPanel` — toggle removable ingredients per dish before adding
- [ ] `OrderDrawer` — slide-out cart summary
- [ ] `/order` review page and `/confirmation` page
- [ ] Persist cart (localStorage) so a refresh doesn't lose it
- [ ] Carry the `table` id (already parsed by `resolveTableId`) through to the order

### 4. Backend / persistence (turns the demo into a real product)
- [ ] Menu from an API/DB instead of `mockMenu.ts`
- [ ] Submit orders to a backend; basic admin/kitchen view

### 5. Polish & nice-to-haves
- [ ] AR "view in your space" on the dish page (WebXR / model-viewer)
- [ ] Light theme toggle, i18n (RO/EN)
- [ ] Accessibility pass (focus states, screen-reader labels on the 3D viewer)
- [ ] Fix `npm run lint` failing on the generated `next-env.d.ts` (see `docs/LANDING.md`)

### Redesign target look (reference)
Espresso background (`#1c1512`) + warm gold accent (`#e0a458`) + sage green (`#7d8b6a`) +
cream text (`#f0e9df`), soft radial "lamp glow" background, Playfair Display headings + Inter body.

---

## How to resume

```bash
cd .worktrees/3d-menu-browsing   # or wherever the 3d-menu-browsing branch is checked out
npm install --legacy-peer-deps
npm test            # baseline: 31 passing
npm run build       # must pass
npm run dev         # http://localhost:3000 (or next free port)
```

Then pick the next item from "What's left to do" above and run it through
brainstorm → spec → plan → implement, keeping all tests green.
