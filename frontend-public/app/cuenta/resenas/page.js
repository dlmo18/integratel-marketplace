"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/lib/data";
import { formatDate } from "@/lib/format";

function Stars({ value }) {
  const full = Math.round(value);
  return (
    <span className="text-yellow-500" aria-label={`${value} de 5 estrellas`}>
      {"★".repeat(full)}
      <span className="text-gray-300">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export default function MyReviewsPage() {
  const { reviews } = useStore();

  // Reseñas escritas por el usuario, de la más reciente a la más antigua.
  const myReviews = [...(reviews || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-movistar-navy">Mis reseñas</h2>
        <span className="text-sm text-movistar-gray-med">
          {myReviews.length} reseña{myReviews.length === 1 ? "" : "s"}
        </span>
      </div>

      {myReviews.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-4xl">⭐</p>
          <p className="mt-3 font-semibold text-movistar-navy">
            Todavía no has escrito reseñas
          </p>
          <p className="mt-1 text-sm text-movistar-gray-med">
            Valora los productos que compraste desde su ficha para ayudar a
            otros compradores.
          </p>
          <Link href="/catalogo" className="btn-primary mt-5 inline-flex">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myReviews.map((r) => {
            const product = getProductById(r.productId);
            return (
              <article key={r.id} className="card p-5">
                <div className="flex gap-4">
                  {product && (
                    <Link
                      href={`/producto/${product.slug}`}
                      className="shrink-0"
                      aria-label={product.name}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    </Link>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3">
                      {product ? (
                        <Link
                          href={`/producto/${product.slug}`}
                          className="line-clamp-1 font-semibold text-movistar-navy hover:text-movistar-blue"
                        >
                          {product.name}
                        </Link>
                      ) : (
                        <span className="font-semibold text-movistar-navy">
                          Producto
                        </span>
                      )}
                      <time className="text-xs text-movistar-gray-med">
                        {formatDate(r.date)}
                      </time>
                    </div>
                    <div className="mt-1 text-sm">
                      <Stars value={r.rating} />
                    </div>
                    {r.title && (
                      <p className="mt-2 font-semibold text-movistar-navy">
                        {r.title}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-movistar-gray-med">
                      {r.comment}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
