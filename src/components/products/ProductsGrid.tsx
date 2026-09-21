'use client';

import React, { useMemo, useState } from 'react';
import type { Product } from '@/lib/content/types';
import ProductCard from '@/components/cards/ProductCard';

export interface ProductsGridProps {
  products: Product[];
  allLabel: string;
  emptyLabel: string;
}

/** Category-filtered product grid. Categories come from the rows themselves. */
export default function ProductsGrid({ products, allLabel, emptyLabel }: ProductsGridProps) {
  const categories = useMemo(() => {
    const seen = new Set<string>();
    products.forEach((p) => p.category && seen.add(p.category));
    return Array.from(seen);
  }, [products]);

  const [active, setActive] = useState<string | null>(null);

  const visible = active ? products.filter((p) => p.category === active) : products;

  return (
    <div>
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-[#161413]/12 pb-6">
          <FilterButton active={active === null} onClick={() => setActive(null)}>
            {allLabel}
          </FilterButton>
          {categories.map((category) => (
            <FilterButton
              key={category}
              active={active === category}
              onClick={() => setActive(category)}
            >
              {category}
            </FilterButton>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-20 text-center text-[15px] text-[#584E44]">{emptyLabel}</p>
      ) : (
        <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`font-syne text-[10px] font-bold uppercase tracking-[0.26em] transition-colors ${
        active ? 'text-[#8B1117]' : 'text-[#161413]/45 hover:text-[#161413]'
      }`}
    >
      {children}
    </button>
  );
}
