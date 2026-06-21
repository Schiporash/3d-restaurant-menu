"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function StaggerGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={container}
      initial={reduce ? false : "hidden"}
      animate="show"
    >
      {children}
    </motion.div>
  );
}
