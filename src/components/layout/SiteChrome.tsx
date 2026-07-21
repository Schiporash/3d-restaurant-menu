"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <>
      <header className="border-b border-[var(--color-accent)]/15 px-4 py-4">
        <span className="font-serif text-2xl font-semibold tracking-wide text-[var(--color-accent)]">
          3D Restaurant Menu
        </span>
      </header>
      <main className="px-4 py-5">{children}</main>
    </>
  );
}
