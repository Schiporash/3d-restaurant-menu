"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import AmbientBackground from "./AmbientBackground";
import PlaceSettingIllustration from "./PlaceSettingIllustration";

// three.js is ~220 kB — keep it out of the QR landing's first paint and let the
// ambient glow carry the hero until it arrives.
const HeroCentrepiece = dynamic(() => import("./HeroCentrepiece"), { ssr: false });

export default function Landing({
  menuHref,
  tableId,
}: {
  menuHref: string;
  tableId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  return (
    <div
      ref={containerRef}
      className="h-svh w-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
    >
      <Link
        href={menuHref}
        className="fixed right-4 top-4 z-50 rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-bg)]/70 px-4 py-1.5 text-xs font-medium text-[var(--color-accent)] backdrop-blur-sm transition-colors hover:border-[var(--color-accent)]/60 hover:text-[var(--color-text)] sm:text-sm"
      >
        Table {tableId} · Menu →
      </Link>

      <section className="relative flex h-svh w-full snap-start flex-col items-center justify-center overflow-hidden px-6 text-center">
        <AmbientBackground />
        <HeroCentrepiece />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="font-serif text-4xl font-semibold tracking-wide text-[var(--color-text)] sm:text-6xl">
            3D Restaurant Menu
          </h1>
          <p className="max-w-md text-sm text-[var(--color-muted)] sm:text-base">
            An evening of warmth, craft and quiet detail — browse tonight&apos;s
            table in three dimensions.
          </p>
        </div>
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

      <section className="relative flex h-svh w-full snap-start flex-col items-center justify-center gap-6 px-6 text-center">
        <PlaceSettingIllustration scrollContainer={containerRef} />
        <div className="flex max-w-md flex-col gap-2">
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">
            Set at your table
          </h2>
          <p className="text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            Every dish is plated with restraint — a handful of honest
            ingredients, given room to speak for themselves.
          </p>
        </div>
      </section>

      <section className="relative flex h-svh w-full snap-start flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex max-w-md flex-col gap-3">
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">
            Tonight&apos;s menu is ready
          </h2>
          <p className="text-sm text-[var(--color-muted)] sm:text-base">
            Explore every dish in interactive 3D before you order.
          </p>
        </div>
        <Link
          href={menuHref}
          className="rounded-full bg-[var(--color-accent)] px-8 py-3 font-serif text-base font-semibold text-[var(--color-bg)] shadow-lg shadow-[var(--color-accent)]/20 transition-transform hover:scale-105"
        >
          View Menu
        </Link>
      </section>
    </div>
  );
}
