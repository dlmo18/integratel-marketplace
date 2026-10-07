"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

// Bloque de mini-tarjetas con los productos favoritos del usuario. Se muestra
// solo si hay favoritos guardados. Enlaza a la lista completa en Mi Cuenta.
export default function FavoritesBlock({ limit = 6 }) {
  const { favorites, addToCart, toggleFavorite } = useStore();

  const products = (favorites || [])
    .map((id) => getProductById(id))
    .filter(Boolean)
    .slice(0, limit);

  if (products.length === 0) return null;

  return (
    <section className="container-page py-12">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-movistar-navy">
          <span>❤️</span> Tus Favoritos
        </h2>
        <Link
          href="/cuenta/favoritos"
          className="text-sm font-semibold text-movistar-blue hover:underline"
        >
          Ver lista de deseos →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {products.map((p) => {
          const outOfStock = p.stock <= 0;
          return (
            <div
              key={p.id}
              className="card group flex flex-col overflow-hidden transition-transform hover:-translate-y-1"
            >
              <div className="relative">
                <Link href={`/producto/${p.slug}`} className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className={`aspect-square w-full object-cover ${
                      outOfStock ? "opacity-60 grayscale" : ""
                    }`}
                    loading="lazy"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => toggleFavorite(p)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-sm"
                  aria-label="Quitar de favoritos"
                  title="Quitar de favoritos"
                >
                  ❤️
                </button>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <Link
                  href={`/producto/${p.slug}`}
                  className="line-clamp-2 text-xs font-semibold hover:text-movistar-blue"
                >
                  {p.name}
                </Link>
                <p className="mt-1 text-sm font-bold text-movistar-navy">
                  {formatCurrency(p.price, p.currency)}
                </p>
                <button
                  onClick={() => addToCart(p, 1)}
                  disabled={outOfStock}
                  className={`mt-2 w-full px-2 py-1.5 text-xs ${
                    outOfStock
                      ? "btn-outline cursor-not-allowed opacity-50"
                      : "btn-primary"
                  }`}
                >
                  {outOfStock ? "Agotado" : "Agregar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
