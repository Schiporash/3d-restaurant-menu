# Progress & Handoff — 3D Restaurant Menu

_Last updated: 2026-06-21. Branch: `3d-menu-browsing`._

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

## 🚧 Next up — ideas (not started)
Cart/ordering flow is the natural next plan. See "Out of scope" below.

### Target look
Espresso background (`#1c1512`) + warm gold accent (`#e0a458`) + sage green (`#7d8b6a`) +
cream text (`#f0e9df`), soft radial "lamp glow" background, Playfair Display headings + Inter body.

---

## How to resume

```bash
cd .worktrees/3d-menu-browsing   # or wherever the 3d-menu-browsing branch is checked out
npm install --legacy-peer-deps
npm test            # baseline: 27 passing
npm run dev         # http://localhost:3000
```

Then execute the redesign plan task-by-task (TDD, commit per task) following
`docs/superpowers/plans/2026-06-21-warm-elegant-redesign.md`. Keep the existing 27 tests green.

---

## Out of scope (future plans)
Cart/ordering flow, real `.glb` models, AR, backend/API, light theme, i18n.
