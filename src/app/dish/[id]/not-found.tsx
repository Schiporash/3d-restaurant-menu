import Link from "next/link";

export default function DishNotFound() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-white/70">We couldn&apos;t find that dish.</p>
      <Link href="/menu" className="text-sm text-[var(--color-accent)]">
        ← Back to menu
      </Link>
    </div>
  );
}
