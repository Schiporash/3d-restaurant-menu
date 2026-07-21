"use client";

import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

type EmberStyle = CSSProperties & { "--ember-opacity"?: number };

const EMBERS = [
  { left: "12%", size: 6, delay: "0s", duration: "14s", opacity: 0.55 },
  { left: "24%", size: 3, delay: "2.5s", duration: "11s", opacity: 0.4 },
  { left: "38%", size: 5, delay: "5s", duration: "16s", opacity: 0.5 },
  { left: "52%", size: 4, delay: "1s", duration: "13s", opacity: 0.35 },
  { left: "68%", size: 7, delay: "4s", duration: "18s", opacity: 0.5 },
  { left: "81%", size: 4, delay: "7s", duration: "12s", opacity: 0.4 },
  { left: "91%", size: 5, delay: "3s", duration: "15s", opacity: 0.45 },
];

export default function AmbientBackground() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(90% 60% at 50% 15%, rgba(224, 164, 88, 0.22) 0%, rgba(224, 164, 88, 0.06) 45%, transparent 75%)",
          animation: reduce ? undefined : "glow-pulse 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 40% at 80% 85%, rgba(125, 139, 106, 0.14) 0%, transparent 70%)",
        }}
      />
      {!reduce &&
        EMBERS.map((ember, index) => (
          <span
            key={index}
            className="absolute bottom-0 rounded-full bg-[var(--color-accent)] blur-[2px]"
            style={
              {
                left: ember.left,
                width: ember.size,
                height: ember.size,
                opacity: 0,
                "--ember-opacity": ember.opacity,
                animation: `ember-drift ${ember.duration} ease-in-out ${ember.delay} infinite`,
              } as EmberStyle
            }
          />
        ))}
    </div>
  );
}
