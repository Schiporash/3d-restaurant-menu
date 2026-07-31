"use client";

import type { RefObject } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { mockDishes } from "@/data/mockMenu";

/**
 * Dishes shown in the approach. Six reads as "a menu" at a glance without
 * turning the hero into a wall of text once the cards fill the viewport.
 */
const FEATURED = mockDishes.slice(0, 6);

/**
 * Warm stand-ins for `modelColor`. The raw palette (lime, coral, neon orange)
 * fights the espresso/gold theme, so the approach uses gold→sage tones instead.
 */
const PLATE_TINTS = [
  "#e0a458",
  "#c98f4a",
  "#a8894f",
  "#7d8b6a",
  "#b5763f",
  "#d3a866",
];

function PlateCard({ index }: { index: number }) {
  const dish = FEATURED[index];
  const tint = PLATE_TINTS[index % PLATE_TINTS.length];

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-accent)]/15 bg-[var(--color-surface)]/80 p-3 shadow-lg shadow-black/30 backdrop-blur-[2px]">
      <div
        className="aspect-[16/10] w-full rounded-lg"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${tint}cc 0%, ${tint}55 38%, transparent 72%)`,
        }}
      />
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate font-serif text-[0.6rem] text-[var(--color-text)]">
          {dish.name}
        </span>
        <span className="shrink-0 font-serif text-[0.6rem] text-[var(--color-accent)]">
          ${dish.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function Layer({
  progress,
  scaleRange,
  opacityStops,
  className,
  indices,
}: {
  progress: MotionValue<number>;
  scaleRange: [number, number];
  opacityStops: [number, number, number, number];
  className: string;
  indices: number[];
}) {
  // Scale runs across the same window the layer is visible in, so the rush is a
  // single sweep: faint-and-far at the first stop, swelling off-screen by the
  // last. Opacity always ends at 0 — the approach is a hero flourish that clears
  // completely before the text sections rather than settling behind them.
  const scale = useTransform(progress, [opacityStops[0], opacityStops[3]], scaleRange);
  const opacity = useTransform(progress, opacityStops, [0.12, 1, 1, 0]);
  const blur = useTransform(progress, [opacityStops[0], opacityStops[1]], [12, 0]);
  const filter = useTransform(blur, (b) => `blur(${b.toFixed(2)}px)`);

  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center ${className}`}
      style={{ scale, opacity, filter }}
    >
      <div className="grid w-[min(760px,88vw)] grid-cols-2 gap-3 sm:grid-cols-3">
        {indices.map((i) => (
          <PlateCard key={i} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Scroll-driven "the menu comes to you" layer.
 *
 * Two grids sit far away and small at the top of the landing; as the diner
 * scrolls they rush forward and swell past the viewport, so the first thing
 * on the site is motion rather than a static hero. The back layer scales more
 * slowly than the front one, which reads as depth rather than a flat zoom.
 */
export default function ApproachingMenu({
  scrollContainer,
}: {
  scrollContainer: RefObject<HTMLDivElement | null>;
}) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ container: scrollContainer });

  // Smooths the jump that scroll-snap produces between sections — without it
  // the grids teleport rather than travel.
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // The approach is decorative motion. For reduced-motion diners there is
  // nothing to settle into, so we skip it entirely and leave the text sections
  // clean rather than parking a static ghost grid behind the copy.
  if (reduce) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      data-testid="approaching-menu"
      aria-hidden="true"
    >
      {/* Back layer travels furthest and swells largest, so it reads as the
          deepest plane rushing past. It clears first, opening space for the
          front layer's final sweep. */}
      <Layer
        progress={progress}
        scaleRange={[0.5, 5.5]}
        opacityStops={[0, 0.08, 0.3, 0.44]}
        className="opacity-60"
        indices={[3, 4, 5]}
      />
      {/* Front layer sweeps a touch later and is fully gone by ~46% progress —
          just as "Set at your table" snaps in — so the text sections land on a
          clean stage rather than a screen of parked cards. */}
      <Layer
        progress={progress}
        scaleRange={[0.4, 3.4]}
        opacityStops={[0, 0.1, 0.34, 0.46]}
        className=""
        indices={[0, 1, 2]}
      />
    </div>
  );
}
