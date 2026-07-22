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
  endOpacity,
}: {
  progress: MotionValue<number>;
  scaleRange: [number, number];
  opacityStops: [number, number, number, number];
  className: string;
  indices: number[];
  /** Opacity once the approach has finished — 0 sweeps past, >0 settles. */
  endOpacity: number;
}) {
  const scale = useTransform(progress, [0, 1], scaleRange);
  const opacity = useTransform(progress, opacityStops, [0.18, 1, 1, endOpacity]);
  const blur = useTransform(progress, [0, 0.35], [10, 0]);
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

  if (reduce) {
    return (
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20"
        aria-hidden="true"
      >
        <div className="grid w-[min(760px,88vw)] grid-cols-2 gap-3 sm:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <PlateCard key={i} index={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      data-testid="approaching-menu"
      aria-hidden="true"
    >
      {/* Back layer travels furthest and sweeps past the viewer, which is what
          sells the depth; it is gone by the CTA so it cannot crowd it. */}
      <Layer
        progress={progress}
        scaleRange={[0.14, 3.4]}
        opacityStops={[0, 0.12, 0.55, 0.82]}
        className="opacity-60"
        indices={[3, 4, 5]}
        endOpacity={0}
      />
      {/* Front layer settles at a readable size and stays, so the diner lands
          on the CTA with the menu already in front of them rather than a
          blank screen. */}
      <Layer
        progress={progress}
        scaleRange={[0.24, 1.75]}
        opacityStops={[0, 0.16, 0.7, 1]}
        className=""
        indices={[0, 1, 2]}
        endOpacity={0.5}
      />
    </div>
  );
}
