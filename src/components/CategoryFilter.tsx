"use client";

const ALL_CATEGORIES = "All";

interface CategoryFilterProps {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  const options = [ALL_CATEGORIES, ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Filter dishes by category">
      {options.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[var(--color-accent)] text-slate-900"
                : "bg-white/5 text-[var(--color-text)] hover:bg-white/10"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
