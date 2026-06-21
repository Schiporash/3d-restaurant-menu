import Link from "next/link";

export default function DishNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-3 py-12 text-center">
      <p className="font-serif text-lg text-[var(--color-text)]">
        We couldn&apos;t find that dish.
      </p>
      <Link
        href="/menu"
        className="text-sm text-[var(--color-accent)] transition-opacity hover:opacity-80"
      >
        ← Back to menu
      </Link>
    </div>
  );
}
