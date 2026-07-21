import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import SiteChrome from "@/components/layout/SiteChrome";
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
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
