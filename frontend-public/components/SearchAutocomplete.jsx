"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

const allProducts = getProducts();
const MAX_RESULTS = 6;

// Buscador del header con autocompletado en vivo.
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
          p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      )
      .slice(0, MAX_RESULTS);
  }, [query]);

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
      if (active >= 0 && results[active]) goToProduct(results[active].slug);
      else goToCatalog();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showPanel = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToCatalog();
        }}
        className="md-search"
        role="search"
      >
        <span className="material-symbols-outlined">search</span>
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
          aria-label="Buscar productos"
          aria-expanded={showPanel}
          autoComplete="off"
        />
      </form>

      {showPanel && (
        <div className="menu-pop" style={{ left: 0, right: 0, width: "auto" }}>
          {results.length === 0 ? (
            <div className="md-center md-muted" style={{ padding: "24px 16px", fontSize: "0.875rem" }}>
              Sin resultados para “{query.trim()}”.
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: 384, overflowY: "auto" }}>
              {results.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goToProduct(p.slug)}
                    className="search-result"
                    style={active === i ? { background: "var(--md-surface-container)" } : undefined}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images?.[0]} alt={p.name} />
                    <div className="md-grow" style={{ minWidth: 0, textAlign: "left" }}>
                      <p className="md-body-medium" style={{ margin: 0, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.name}
                      </p>
                      <p className="md-muted" style={{ margin: 0, fontSize: "0.7rem", textTransform: "uppercase" }}>
                        {p.brand}
                      </p>
                    </div>
                    <span className="md-primary-text" style={{ fontWeight: 700, fontSize: "0.875rem", whiteSpace: "nowrap" }}>
                      {formatCurrency(p.price, p.currency)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button type="button" onClick={goToCatalog} className="panel-head" style={{ width: "100%", cursor: "pointer", border: "none", borderTop: "1px solid var(--md-outline-variant)", background: "var(--md-surface-container)", color: "var(--md-primary)", textAlign: "center", padding: "10px 16px", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>
            Ver todos los resultados en el catálogo →
          </button>
        </div>
      )}
    </div>
  );
}
