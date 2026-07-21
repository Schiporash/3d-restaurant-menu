# Ambient Landing Page — what was added & what comes next

_Added: 2026-07-21. Branch: `3d-menu-browsing`._

An ambient, "showroom"-style landing page at `/`, inspired by a luxury
architecture-gallery site (scroll-snap sections, restrained warm palette,
line art that draws itself on scroll, lazy-loaded heavy assets).

---

## ✅ What was added

### Behaviour change: `/` no longer auto-redirects

Previously `/` immediately `redirect()`ed to `/menu?table=N`. It now renders a
three-section landing, and the diner continues to the menu via a CTA (or the
persistent shortcut, below).

### Components

| File | What it does |
| --- | --- |
| `src/components/landing/Landing.tsx` | Scroll-snap container + the three sections |
| `src/components/landing/AmbientBackground.tsx` | Procedural warm glow + drifting "ember" particles (pure CSS, no image assets) |
| `src/components/landing/HeroCentrepiece.tsx` | Slowly rotating 3D torus in the hero, reusing `three/DishMesh` |
| `src/components/landing/PlaceSettingIllustration.tsx` | Inline SVG plate/fork/knife/glass that draws itself on scroll |
| `src/components/layout/SiteChrome.tsx` | Hides the header + page padding on `/` only, so the hero is full-bleed |

### The three sections

1. **Hero** — restaurant name, tagline, ambient glow + 3D centrepiece, scroll cue
2. **Experience** — the line-art place setting drawing in on scroll, plus copy
3. **CTA** — "View Menu" button linking to `/menu?table=N`

### Table number (completes roadmap item #2)

`resolveTableId()` was extracted from `buildMenuUrl()` in `src/lib/menuUrl.ts`
so both share one parsing path. The landing shows a persistent pill in the
top-right — **"Table 12 · Menu →"** — which doubles as a skip link so repeat
visitors aren't forced to scroll all three sections to reach the menu.

### Notes / decisions worth keeping

- **three.js is lazy-loaded.** Importing `HeroCentrepiece` directly pushed `/`
  from 152 kB → 373 kB First Load JS — unacceptable on the QR entry point a
  diner hits on phone data. It now loads via `next/dynamic` with `ssr: false`
  (back to ~153 kB); the ambient glow covers the gap until it arrives.
- **No `OrbitControls` on the hero**, deliberately — it would capture scroll
  and drag gestures and break scroll-snap. The spin uses `useFrame` instead.
- **Everything respects `prefers-reduced-motion`**, matching the existing
  `FadeIn`/`StaggerGrid` convention: static glow, static illustration, no spin.
- No new dependencies — `framer-motion`, R3F and Tailwind were already present.
  (The reference site used vanilla Tilt.js; framer-motion covers it.)

### Verification at time of writing

- `npm test` — **38 passing** (up from 31)
- `npm run build` — passes
- `/menu` and `/dish/[id]` unchanged and unregressed

---

## 🚧 What comes next

### 1. Dish-level treatment (direct follow-on from this work)
- [ ] Mouse-parallax **tilt on `DishCard`** — the one technique from the
      reference site not yet applied. Cheap via framer-motion; no Tilt.js.
- [ ] Loading skeletons for the menu grid.

### 2. Real 3D dish models — the big visual unlock
The hero torus and the dish-card previews are all **placeholder procedural
geometry** (`three/DishMesh.tsx`). They read as elegant abstract motion, not as
food. Options discussed:
- **Photorealistic:** Luma AI Capture / Polycam — photograph the real dishes,
  get Gaussian splats. Highest fidelity, but splats are *not* glTF meshes, so
  this needs a splat renderer (e.g. `@mkkellogg/gaussian-splats-3d`) or a
  conversion step rather than the existing `useGLTF` path.
- **Fast to integrate:** Meshy AI / Tripo AI — text-or-photo → clean `.glb`
  that drops straight into `useGLTF`. Stylized approximation, not the real dish.

Either way: add a `modelUrl` field to `Dish` and a loading fallback.

### 3. Cart & ordering flow (was explicitly out of scope for v1)
`OrderContext`, `CustomizerPanel`, `OrderDrawer`, `/order`, `/confirmation`,
localStorage persistence. See `PROGRESS.md`.

### 4. Backend / persistence
Menu from an API/DB instead of `mockMenu.ts`; submit orders; kitchen view.

### 5. Known small issues
- [ ] `next-env.d.ts` — building with Next 15.5.19 regenerates this file with a
      triple-slash reference that the current eslint config rejects
      (`@typescript-eslint/triple-slash-reference`), so `npm run lint` fails on
      a **generated** file. Worth an eslint ignore for it. The regeneration was
      deliberately kept out of this change.
- [ ] Don't run `npm run build` while `npm run dev` is running — they share
      `.next/` and the dev server will start throwing
      "Could not find the module … in the React Client Manifest" 500s. Fix is
      `rm -rf .next` and restart dev.
