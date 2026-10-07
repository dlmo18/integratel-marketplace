"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

const allProducts = getProducts();
const MAX_RESULTS = 6;

// Buscador del header con autocompletado en vivo. Filtra el catálogo mientras
// se escribe y muestra una lista con imagen, nombre, marca y precio. Permite
// ir directo a un producto o a la búsqueda completa en el catálogo.
export default function SearchAutocomplete() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const containerRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      )
      .slice(0, MAX_RESULTS);
  }, [query]);

  // Cierra al hacer clic fuera.
  useEffect(() => {
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const goToCatalog = () => {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/catalogo?buscar=${encodeURIComponent(q)}`);
  };

  const goToProduct = (slug) => {
    setOpen(false);
    setQuery("");
    router.push(`/producto/${slug}`);
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && results[active]) {
        goToProduct(results[active].slug);
      } else {
        goToCatalog();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showPanel = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToCatalog();
        }}
        className="flex items-center overflow-hidden rounded-full bg-white shadow-sm"
        role="search"
      >
        <span className="pl-4 text-movistar-gray-med">🔍</span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          type="search"
          placeholder="Busca productos, marcas y más…"
          className="w-full bg-transparent px-3 py-2.5 text-sm text-movistar-navy outline-none placeholder:text-movistar-gray-med"
          aria-label="Buscar productos"
          aria-expanded={showPanel}
          autoComplete="off"
        />
        <button
          type="submit"
          className="m-1 rounded-full bg-movistar-blue px-4 py-1.5 text-xs font-semibold text-white hover:bg-movistar-blue/90"
        >
          Buscar
        </button>
      </form>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl bg-white text-movistar-navy shadow-2xl ring-1 ring-black/5">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-movistar-gray-med">
              Sin resultados para “{query.trim()}”.
            </div>
          ) : (
            <ul className="max-h-96 divide-y overflow-y-auto">
              {results.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goToProduct(p.slug)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${
                      active === i ? "bg-movistar-gray" : "hover:bg-movistar-gray"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="h-12 w-12 flex-shrink-0 rounded-lg bg-movistar-gray object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold">
                        {p.name}
                      </p>
                      <p className="text-xs uppercase text-movistar-gray-med">
                        {p.brand}
                      </p>
                    </div>
                    <span className="whitespace-nowrap text-sm font-bold text-movistar-blue">
                      {formatCurrency(p.price, p.currency)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={goToCatalog}
            className="block w-full border-t bg-movistar-gray px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-movistar-blue hover:underline"
          >
            Ver todos los resultados en el catálogo →
          </button>
        </div>
      )}
    </div>
  );
}
