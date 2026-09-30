"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/lib/format";

export default function ProductCard({ product }) {
  const { addToCart } = useStore();
  const discount =
    product.listPrice && product.listPrice > product.price
      ? Math.round((1 - product.price / product.listPrice) * 100)
      : 0;

  return (
    <div className="card group flex flex-col overflow-hidden transition-transform hover:-translate-y-1">
      <Link href={`/producto/${product.slug}`} className="relative block">
        <div className="aspect-square overflow-hidden bg-movistar-gray">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
        {discount > 0 && (
          <span className="badge absolute left-3 top-3 bg-movistar-green text-white">
            -{discount}%
          </span>
        )}
        {product.category === "movistar" && (
          <span className="badge absolute right-3 top-3 bg-movistar-blue text-white">
            Movistar
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs uppercase text-movistar-gray-med">
          {product.brand}
        </span>
        <Link
          href={`/producto/${product.slug}`}
          className="mt-1 line-clamp-2 text-sm font-semibold hover:text-movistar-blue"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-yellow-500">
          {"★".repeat(Math.round(product.rating))}
          <span className="text-movistar-gray-med">({product.reviews})</span>
        </div>
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-movistar-navy">
              {formatCurrency(product.price, product.currency)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-movistar-gray-med line-through">
                {formatCurrency(product.listPrice, product.currency)}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product, 1)}
            className="btn-primary mt-3 w-full"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
