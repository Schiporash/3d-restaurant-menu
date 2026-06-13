import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Restaurant Menu",
  description: "Browse dishes in interactive 3D and place your order from the table.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <header className="border-b border-white/10 px-4 py-3">
          <span className="text-lg font-semibold tracking-wide text-[var(--color-accent)]">
            3D Restaurant Menu
          </span>
        </header>
        <main className="px-4 py-4">{children}</main>
      </body>
    </html>
  );
}
