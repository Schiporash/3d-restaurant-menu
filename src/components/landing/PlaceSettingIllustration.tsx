"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";

export default function PlaceSettingIllustration({
  scrollContainer,
}: {
  scrollContainer: RefObject<HTMLElement | null>;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    target: wrapperRef,
    offset: ["start end", "start start"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={wrapperRef}>
      <svg
        viewBox="0 0 220 160"
        className="h-40 w-56 text-[var(--color-accent)]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* plate */}
        <motion.circle
          cx="110"
          cy="80"
          r="42"
          style={reduce ? undefined : { pathLength }}
          pathLength={reduce ? 1 : undefined}
        />
        <motion.circle
          cx="110"
          cy="80"
          r="28"
          style={reduce ? undefined : { pathLength }}
          pathLength={reduce ? 1 : undefined}
        />
        {/* fork */}
        <motion.path
          d="M40 30 V70 M46 30 V70 M52 30 V70 M40 70 Q40 78 46 78 V140 M52 70 V78"
          style={reduce ? undefined : { pathLength }}
          pathLength={reduce ? 1 : undefined}
        />
        {/* knife */}
        <motion.path
          d="M180 30 V95 Q180 100 176 100 Q172 100 172 95 V50 Q172 30 180 30 Z M176 100 V140"
          style={reduce ? undefined : { pathLength }}
          pathLength={reduce ? 1 : undefined}
        />
        {/* wine glass */}
        <motion.path
          d="M100 10 H120 Q120 28 110 28 Q100 28 100 10 Z M110 28 V44 M100 44 H120"
          style={reduce ? undefined : { pathLength }}
          pathLength={reduce ? 1 : undefined}
        />
      </svg>
    </div>
  );
}
