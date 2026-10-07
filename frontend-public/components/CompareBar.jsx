"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/lib/data";

// Barra flotante global del comparador. Aparece en cualquier página cuando hay
// productos seleccionados para comparar y enlaza a /comparar.
export default function CompareBar() {
  const { compare, maxCompare, toggleCompare, clearCompare } = useStore();
  const pathname = usePathname();

  // En la propia página de comparación no mostramos la barra (sería redundante).
  if (pathname === "/comparar") return null;
  if (!compare || compare.length === 0) return null;

  const products = compare.map((id) => getProductById(id)).filter(Boolean);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="container-page flex flex-wrap items-center gap-3 py-3">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-movistar-navy">
          ⚖️ Comparando {products.length} de {maxCompare}
        </span>
        <div className="flex flex-1 flex-wrap gap-2">
          {products.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-movistar-gray px-2.5 py-1 text-xs text-movistar-navy"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.images?.[0]}
                alt={p.name}
                className="h-5 w-5 rounded-full object-cover"
              />
              <span className="max-w-[120px] truncate">{p.name}</span>
              <button
                onClick={() => toggleCompare(p)}
                className="text-movistar-gray-med hover:text-red-500"
                aria-label={`Quitar ${p.name}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <button
          onClick={clearCompare}
          className="text-xs text-movistar-gray-med hover:underline"
        >
          Limpiar
        </button>
        <Link
          href="/comparar"
          className={`btn-primary ${
            products.length < 2 ? "pointer-events-none opacity-50" : ""
          }`}
          title={
            products.length < 2
              ? "Selecciona al menos 2 productos"
              : "Ver comparación"
          }
          aria-disabled={products.length < 2}
        >
          Comparar
        </Link>
      </div>
    </div>
  );
}
