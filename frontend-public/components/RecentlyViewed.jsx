"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

// Carrusel horizontal de productos vistos recientemente. Se alimenta de
// store.recent (ids ordenados del más reciente al más antiguo). Opcionalmente
// se puede excluir un producto (p. ej. el que se está viendo ahora).
export default function RecentlyViewed({ excludeId, title = "Vistos recientemente" }) {
  const { recent } = useStore();

  const products = (recent || [])
    .filter((id) => id !== excludeId)
    .map((id) => getProductById(id))
    .filter(Boolean);

  if (products.length === 0) return null;

  return (
    <section className="container-page py-10">
      <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-movistar-navy">
        <span>🕘</span> {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/producto/${p.slug}`}
            className="card w-40 shrink-0 overflow-hidden transition-transform hover:-translate-y-1 sm:w-44"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.images?.[0]}
              alt={p.name}
              className="aspect-square w-full object-cover"
            />
            <div className="p-3">
              <p className="text-[11px] uppercase text-movistar-gray-med">
                {p.brand}
              </p>
              <p className="line-clamp-2 text-xs font-semibold">{p.name}</p>
              <p className="mt-1 text-sm font-bold text-movistar-navy">
                {formatCurrency(p.price, p.currency)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
