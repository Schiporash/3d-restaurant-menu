"use client";

import type { ReactNode, RefObject } from "react";
import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import AmbientBackground from "./AmbientBackground";
// Approaching-menu sweep is paused for now — every section carries the ambient
// glow instead. Kept imported-but-parked so it's a one-line restore.
// import ApproachingMenu from "./ApproachingMenu";
import PlaceSettingIllustration from "./PlaceSettingIllustration";
import { mockDishes } from "@/data/mockMenu";

// three.js is ~220 kB — keep it out of the QR landing's first paint and let the
// ambient glow carry the hero until it arrives.
const HeroCentrepiece = dynamic(() => import("./HeroCentrepiece"), { ssr: false });

// The at-a-glance stats are derived from the menu itself, so they stay honest
// as dishes come and go rather than drifting out of date.
const DISH_COUNT = mockDishes.length;
const CATEGORY_COUNT = new Set(mockDishes.map((d) => d.category)).size;
const FROM_PRICE = Math.min(...mockDishes.map((d) => d.price));

/**
 * Keeps section copy legible over the ambient glow — and cheap insurance for the
 * brief overlap while a section snaps in.
 */
function Scrim() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse 64% 48% at 50% 50%, rgba(28,21,18,0.98) 0%, rgba(28,21,18,0.92) 38%, rgba(28,21,18,0.6) 66%, transparent 84%)",
      }}
    />
  );
}

/** Small tracked label with flanking hairlines — the thread that ties the three
 *  sections together as one unfolding evening. */
function Eyebrow({ children }: { children: string }) {
  return (
    <span className="relative flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.35em] text-[var(--color-accent)]">
      <span className="h-px w-6 bg-[var(--color-accent)]/40" aria-hidden="true" />
      {children}
      <span className="h-px w-6 bg-[var(--color-accent)]/40" aria-hidden="true" />
    </span>
  );
}

/** Line-icon wrapper so every glyph shares stroke weight and sizing. */
function LineIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const VALUES: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Locally sourced",
    body: "Market produce, chosen each morning.",
    icon: (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6" />
      </>
    ),
  },
  {
    title: "Made to order",
    body: "Every plate cooked the moment you ask.",
    icon: (
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
    ),
  },
  {
    title: "Allergen-aware",
    body: "Tap any dish to see exactly what's inside.",
    icon: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
];

const STATS: { value: string; label: string }[] = [
  { value: String(DISH_COUNT), label: "Dishes" },
  { value: String(CATEGORY_COUNT), label: "Categories" },
  { value: `$${FROM_PRICE.toFixed(0)}`, label: "From" },
];

// A trio of quiet reassurances for the welcome — the QR diner's first questions
// ("do I need an app? can I take my time?") answered before they're asked.
const WELCOME_META: { label: string; icon: ReactNode }[] = [
  {
    label: "Browse in 3D",
    icon: (
      <>
        <path d="M21 8V16L12 21L3 16V8L12 3Z" />
        <path d="M3 8L12 13L21 8" />
        <path d="M12 13V21" />
      </>
    ),
  },
  {
    label: "Order at your pace",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    label: "No app needed",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.5 2.5L16 9" />
      </>
    ),
  },
];

// A shared reveal so the added detail rises gently into view as each section
// snaps in — the "interesting" bit, kept subtle enough to stay tasteful.
function reveal(reduce: boolean | null, root: RefObject<HTMLDivElement | null>, delay = 0) {
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4, root },
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
  };
}

export default function Landing({
  menuHref,
  tableId,
}: {
  menuHref: string;
  tableId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ container: containerRef });

  // The hero title pulls back slightly as you scroll, so it hands off to the
  // next section rather than lingering.
  const heroScale = useTransform(scrollYProgress, [0, 0.34], [1, 0.82]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="h-svh w-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
    >
      {/* <ApproachingMenu scrollContainer={containerRef} /> */}
      <Link
        href={menuHref}
        className="fixed right-4 top-4 z-50 rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-bg)]/70 px-4 py-1.5 text-xs font-medium text-[var(--color-accent)] backdrop-blur-sm transition-colors hover:border-[var(--color-accent)]/60 hover:text-[var(--color-text)] sm:text-sm"
      >
        Table {tableId} · Menu →
      </Link>

      {/* ① The welcome */}
      <section className="relative flex h-svh w-full snap-start flex-col items-center justify-center overflow-hidden px-6 text-center">
        <AmbientBackground />
        <HeroCentrepiece />
        <motion.div
          className="relative z-10 flex flex-col items-center gap-4"
          style={reduce ? undefined : { scale: heroScale, opacity: heroOpacity }}
        >
          <Eyebrow>Good evening</Eyebrow>
          <h1 className="font-serif text-4xl font-semibold tracking-wide text-[var(--color-text)] drop-shadow-[0_2px_18px_rgba(28,21,18,0.9)] sm:text-6xl">
            3D Restaurant Menu
          </h1>
          <p className="max-w-md text-sm text-[var(--color-muted)] drop-shadow-[0_2px_12px_rgba(28,21,18,0.9)] sm:text-base">
            An evening of warmth, craft and quiet detail — browse tonight&apos;s
            table in three dimensions.
          </p>
          <motion.div
            className="mt-2 flex items-center divide-x divide-[var(--color-accent)]/20 text-xs text-[var(--color-muted)] drop-shadow-[0_2px_10px_rgba(28,21,18,0.9)]"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            {WELCOME_META.map((item) => (
              <span key={item.label} className="flex items-center gap-1.5 px-3 sm:px-4">
                <span className="text-[var(--color-accent)]">
                  <LineIcon>{item.icon}</LineIcon>
                </span>
                {item.label}
              </span>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute bottom-10 z-10 text-[var(--color-accent)]"
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M4 7 L10 13 L16 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </section>

      {/* ② The care */}
      <section className="relative z-10 flex h-svh w-full snap-start flex-col items-center justify-center gap-7 px-6 text-center">
        <AmbientBackground />
        <Scrim />
        <PlaceSettingIllustration scrollContainer={containerRef} />
        <div className="relative flex max-w-2xl flex-col items-center gap-4">
          <Eyebrow>Made with care</Eyebrow>
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">
            Set at your table
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            Every dish is plated with restraint — a handful of honest
            ingredients, given room to speak for themselves.
          </p>
        </div>
        <div className="relative grid w-full max-w-2xl gap-4 sm:grid-cols-3">
          {VALUES.map((value, i) => (
            <motion.div
              key={value.title}
              {...reveal(reduce, containerRef, i * 0.09)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-accent)]/12 bg-[var(--color-surface)]/40 px-4 py-5 backdrop-blur-[1px]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-accent)]/25 text-[var(--color-accent)]">
                <LineIcon>{value.icon}</LineIcon>
              </span>
              <span className="font-serif text-sm text-[var(--color-text)]">
                {value.title}
              </span>
              <span className="text-xs leading-relaxed text-[var(--color-muted)]">
                {value.body}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ③ The menu */}
      <section className="relative z-10 flex h-svh w-full snap-start flex-col items-center justify-center gap-6 px-6 text-center">
        <AmbientBackground />
        <Scrim />
        <div className="relative flex max-w-md flex-col items-center gap-5">
          <Eyebrow>This evening</Eyebrow>
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">
              Tonight&apos;s menu is ready
            </h2>
            <p className="text-sm text-[var(--color-muted)] sm:text-base">
              Explore every dish in interactive 3D before you order.
            </p>
          </div>
          <motion.div
            {...reveal(reduce, containerRef, 0.1)}
            className="flex items-center divide-x divide-[var(--color-accent)]/15"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center px-6">
                <span className="font-serif text-2xl text-[var(--color-accent)] sm:text-3xl">
                  {stat.value}
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
          <p className="text-xs text-[var(--color-muted)]">
            Vegan &amp; vegetarian options throughout.
          </p>
        </div>
        <Link
          href={menuHref}
          className="relative rounded-full bg-[var(--color-accent)] px-8 py-3 font-serif text-base font-semibold text-[var(--color-bg)] shadow-lg shadow-[var(--color-accent)]/20 transition-transform hover:scale-105"
        >
          View Menu
        </Link>
        <p className="relative max-w-xs text-xs italic text-[var(--color-muted)]">
          Take your time — we&apos;re glad you&apos;re here.
        </p>
      </section>
    </div>
  );
}
