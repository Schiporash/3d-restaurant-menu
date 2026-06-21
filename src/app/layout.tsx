import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "3D Restaurant Menu",
  description: "Browse dishes in interactive 3D and place your order from the table.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <header className="border-b border-[var(--color-accent)]/15 px-4 py-4">
          <span className="font-serif text-2xl font-semibold tracking-wide text-[var(--color-accent)]">
            3D Restaurant Menu
          </span>
        </header>
        <main className="px-4 py-5">{children}</main>
      </body>
    </html>
  );
}
