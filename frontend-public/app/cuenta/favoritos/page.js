"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default function WishlistPage() {
  const { favorites, toggleFavorite, addToCart } = useStore();

  const products = (favorites || [])
    .map((id) => getProductById(id))
    .filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-movistar-navy">
          Lista de deseos
        </h2>
        <span className="text-sm text-movistar-gray-med">
          {products.length} producto{products.length === 1 ? "" : "s"}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-4xl">🤍</p>
          <p className="mt-3 font-semibold text-movistar-navy">
            Aún no tienes favoritos
          </p>
          <p className="mt-1 text-sm text-movistar-gray-med">
            Pulsa el corazón en cualquier producto para guardarlo aquí.
          </p>
          <Link href="/catalogo" className="btn-primary mt-5 inline-flex">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((p) => {
            const outOfStock = p.stock <= 0;
            const discount =
              p.listPrice > p.price
                ? Math.round((1 - p.price / p.listPrice) * 100)
                : 0;
            return (
              <div key={p.id} className="card flex gap-4 p-4">
                <Link
                  href={`/producto/${p.slug}`}
                  className="shrink-0"
                  aria-label={p.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className={`h-24 w-24 rounded-xl object-cover ${
                      outOfStock ? "opacity-60 grayscale" : ""
                    }`}
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-xs uppercase text-movistar-gray-med">
                    {p.brand}
                  </span>
                  <Link
                    href={`/producto/${p.slug}`}
                    className="line-clamp-2 text-sm font-semibold hover:text-movistar-blue"
                  >
                    {p.name}
                  </Link>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-bold text-movistar-navy">
                      {formatCurrency(p.price, p.currency)}
                    </span>
                    {discount > 0 && (
                      <span className="text-xs text-movistar-gray-med line-through">
                        {formatCurrency(p.listPrice, p.currency)}
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-3">
                    <button
                      onClick={() => addToCart(p, 1)}
                      disabled={outOfStock}
                      className={`px-4 py-1.5 text-xs ${
                        outOfStock
                          ? "btn-outline cursor-not-allowed opacity-50"
                          : "btn-primary"
                      }`}
                    >
                      {outOfStock ? "Agotado" : "Agregar al carrito"}
                    </button>
                    <button
                      onClick={() => toggleFavorite(p)}
                      className="rounded-full border border-gray-300 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
