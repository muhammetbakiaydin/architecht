import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Product } from '@/lib/content/types';

export interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={{ pathname: '/products/[slug]', params: { slug: product.slug } }}
      className="group flex flex-col"
    >
      <div className="relative overflow-hidden bg-[#E6DCCC]" style={{ aspectRatio: '4 / 5' }}>
        {product.coverUrl && (
          <Image
            src={product.coverUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        )}
        {product.category && (
          <span className="absolute left-3 top-3 bg-[#F5EFE6]/90 px-2.5 py-1 font-syne text-[9px] font-bold uppercase tracking-[0.22em] text-[#161413]">
            {product.category}
          </span>
        )}
      </div>

      <div className="mt-5">
        <h3 className="font-syne text-[17px] font-bold leading-tight tracking-[-0.01em] text-[#161413] transition-colors group-hover:text-[#8B1117]">
          {product.name}
        </h3>
        {product.summary && (
          <p className="mt-2 max-w-[38ch] text-[13px] leading-[1.7] text-[#584E44]">
            {product.summary}
          </p>
        )}
        {product.material && (
          <p className="mt-3 font-syne text-[9px] font-bold uppercase tracking-[0.22em] text-[#161413]/40">
            {product.material}
          </p>
        )}
      </div>
    </Link>
  );
}
