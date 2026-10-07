"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/lib/format";

// Umbral de "poco stock" para mostrar el badge de urgencia.
const LOW_STOCK = 5;

export default function ProductCard({ product, showCompare = true }) {
  const {
    addToCart,
    isFavorite,
    toggleFavorite,
    isComparing,
    toggleCompare,
    canAddCompare
  } = useStore();

  const discount =
    product.listPrice && product.listPrice > product.price
      ? Math.round((1 - product.price / product.listPrice) * 100)
      : 0;

  const fav = isFavorite(product.id);
  const comparing = isComparing(product.id);
  const compareDisabled = !comparing && !canAddCompare;
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= LOW_STOCK;

  return (
    <div className="card group flex flex-col overflow-hidden transition-transform hover:-translate-y-1">
      <div className="relative">
        <Link href={`/producto/${product.slug}`} className="block">
          <div className="aspect-square overflow-hidden bg-movistar-gray">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images?.[0]}
              alt={product.name}
              className={`h-full w-full object-cover transition-transform group-hover:scale-105 ${
                outOfStock ? "opacity-60 grayscale" : ""
              }`}
              loading="lazy"
            />
          </div>
        </Link>

        {/* Badges superiores izquierda: descuento / categoría movistar */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge w-fit bg-movistar-green text-white">
              -{discount}%
            </span>
          )}
          {product.category === "movistar" && (
            <span className="badge w-fit bg-movistar-blue text-white">
              Movistar
            </span>
          )}
        </div>

        {/* Botón de favoritos (corazón) */}
        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-lg shadow-sm backdrop-blur-sm transition-colors ${
            fav
              ? "bg-red-500 text-white"
              : "bg-white/90 text-movistar-navy hover:bg-white"
          }`}
          aria-pressed={fav}
          aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
          title={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          {fav ? "❤️" : "🤍"}
        </button>

        {/* Casilla Comparar */}
        {showCompare && (
          <label
            className={`absolute bottom-3 left-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm transition-colors ${
              comparing
                ? "bg-movistar-blue text-white"
                : "bg-white/90 text-movistar-navy hover:bg-white"
            } ${compareDisabled ? "cursor-not-allowed opacity-50" : ""}`}
            title={
              compareDisabled
                ? "Máximo 4 productos"
                : "Agregar a comparación"
            }
          >
            <input
              type="checkbox"
              className="h-3.5 w-3.5 accent-movistar-blue"
              checked={comparing}
              disabled={compareDisabled}
              onChange={() => toggleCompare(product)}
            />
            Comparar
          </label>
        )}

        {/* Badge de stock / urgencia (abajo derecha) */}
        {outOfStock ? (
          <span className="badge absolute bottom-3 right-3 bg-movistar-gray-med text-white">
            Agotado
          </span>
        ) : lowStock ? (
          <span className="badge absolute bottom-3 right-3 animate-pulse bg-red-500 text-white">
            ¡Últimas {product.stock}!
          </span>
        ) : null}
      </div>

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
            disabled={outOfStock}
            className={`mt-3 w-full ${
              outOfStock
                ? "btn-outline cursor-not-allowed opacity-50"
                : "btn-primary"
            }`}
          >
            {outOfStock ? "Agotado" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}
