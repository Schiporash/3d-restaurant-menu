# Warm & Elegant Frontend Redesign — Design Spec

**Goal:** Transform the existing functional-but-flat 3D restaurant menu into a warm, cozy, elegant
experience with smooth, refined ("line") animations — a hybrid of "cozy library/study warmth"
(inspired by warm wood + soft lamp lighting) and "fine dining" sophistication.

**Scope:** Visual + motion redesign only. No new pages, no backend, no data-model changes. All
existing routes (`/`, `/menu`, `/dish/[id]`) and behaviors (search, category filter, 3D viewer,
not-found) stay functionally identical. Tests must continue to pass; where markup changes break a
test selector, the test is updated to match new markup without weakening its assertion.

---

## 1. Design Tokens (Palette & Atmosphere)

Replace the current cold blue theme in `src/app/globals.css` `@theme` block:

| Token | Current | New | Role |
|-------|---------|-----|------|
| `--color-bg` | `#0d1b2a` | `#1c1512` | Deep espresso background |
| `--color-surface` | `#14253b` | `#2a2018` | Warm card/surface |
| `--color-accent` | `#f4a261` | `#e0a458` | Warm gold (primary accent) |
| `--color-accent-2` | — | `#7d8b6a` | Muted sage green (secondary accent) |
| `--color-text` | `#e8e6e3` | `#f0e9df` | Warm cream text |
| `--color-muted` | — | `#a99e90` | Muted warm text (descriptions, hints) |

**Background atmosphere:** add a subtle fixed radial gradient on `body` (warm amber glow, top-center,
fading to espresso) to evoke soft lamp lighting and add depth. Implemented in `globals.css`, no JS.

## 2. Typography

- **Headings (display):** an elegant serif — load `Playfair Display` via `next/font/google`.
  Applied to: header wordmark, dish names on detail page, page-level titles.
- **Body:** keep a clean sans — load `Inter` via `next/font/google` for body/UI text.
- Wire both fonts as CSS variables in `layout.tsx` and expose Tailwind utilities
  (`font-serif` → Playfair, `font-sans` → Inter).

## 3. Motion System (Framer Motion)

Add dependency: `framer-motion` (latest, React 19 compatible). Create a small set of reusable
motion primitives so motion is consistent and testable, not scattered inline.

- **`src/components/motion/FadeIn.tsx`** — fade + slide-up wrapper (configurable delay) for sections.
- **`src/components/motion/StaggerGrid.tsx`** — container that staggers children entrance
  (used by the dish grid so cards cascade in).
- **Animated category underline:** the active `CategoryFilter` tab gets a sliding underline using
  Framer Motion's `layoutId` (shared layout animation) so the line glides between tabs.
- **Card hover:** lift (translateY), warm glow (box-shadow), and a subtle 3D tilt on pointer move.
- **Page transition:** fade/slide between `/menu` and `/dish/[id]` via a shared motion wrapper.
- **Reduced motion:** all entrance/hover motion respects `prefers-reduced-motion` (Framer Motion's
  `useReducedMotion`) — animations degrade to instant/opacity-only.

## 4. 3D Previews on Dish Cards (lazy)

Today each `DishCard` shows a flat `modelColor` rectangle. Replace with a richer preview:

- **Default state:** a warm animated gradient "orb" derived from `modelColor` (CSS, cheap) so all
  cards look alive without 10 live WebGL contexts.
- **Lazy 3D upgrade:** when a card scrolls into view (IntersectionObserver) OR on hover, mount a
  small auto-rotating `Viewer3D`-style canvas for that card. Off-screen cards stay as gradient orbs.
- **Component:** `src/components/DishCardPreview.tsx` encapsulates the orb ↔ lazy-3D logic so
  `DishCard` stays simple. Reuses the existing shape→geometry mapping from `Viewer3D`.
- **Performance guard:** cap concurrently-mounted 3D canvases (e.g. only the in-view/hovered card);
  full, always-on 3D remains exclusive to `/dish/[id]`.

**Refactor note:** extract the shape→geometry `DishMesh` switch out of `Viewer3D.tsx` into a shared
`src/components/three/DishMesh.tsx` so both `Viewer3D` (detail) and `DishCardPreview` (card) use one
source of truth instead of duplicating geometry.

## 5. Component-Level Changes

- **`layout.tsx`** — load fonts; restyle header into an elegant serif wordmark with a thin warm
  divider; wrap `main` for page-transition motion.
- **`globals.css`** — new tokens, background gradient, font-variable wiring.
- **`CategoryFilter.tsx`** — warmer pill styling + Framer Motion sliding underline (keep
  `role="tab"`/`aria-selected` so existing tests pass).
- **`DishCard.tsx`** — warm card styling, serif dish name, gold price, `DishCardPreview` instead of
  flat rectangle, Framer Motion hover (keep `data-testid="dish-card"` + `href`).
- **`DishCardPreview.tsx`** (new) — gradient orb + lazy 3D.
- **`three/DishMesh.tsx`** (new) — shared geometry.
- **`Viewer3D.tsx`** — consume shared `DishMesh`; warmer lighting/background; keep
  `data-testid="viewer3d"` + `data-shape`.
- **`menu/page.tsx`** — `StaggerGrid` for cards, restyle search input (warm, focus-glow), keep
  placeholder text + empty-state message (tests depend on them).
- **`dish/[id]/page.tsx`** — `FadeIn` sections, serif name, refined spacing, styled back link.
- **`dish/[id]/not-found.tsx`** & **`AllergenBadge.tsx`** — restyle to warm palette (badge colors
  shift to warm-toned variants; keep `data-testid="allergen-badge"` + labels).

## 6. Testing

- Existing 27 tests must stay green. Update only selectors/markup-coupled assertions that the
  redesign legitimately changes; never weaken an assertion to make it pass.
- New logic units get tests: gradient-orb color derivation helper (pure function) and the
  in-view/hover gating logic for lazy 3D (where it can be unit-tested without WebGL — mock the
  canvas as the current `Viewer3D` test already does).
- Motion components: smoke-test that they render children (Framer Motion runs in jsdom).

## Out of Scope

Cart/ordering, real `.glb` models, AR, light theme, backend, i18n. Pure look-and-motion redesign.
