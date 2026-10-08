"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/lib/data";

// Barra flotante global del comparador. Enlaza a /comparar.
export default function CompareBar() {
  const { compare, maxCompare, toggleCompare, clearCompare } = useStore();
  const pathname = usePathname();

  if (pathname === "/comparar") return null;
  if (!compare || compare.length === 0) return null;

  const products = compare.map((id) => getProductById(id)).filter(Boolean);

  return (
    <div className="compare-bar">
      <div className="md-container">
        <span className="md-title-small" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            balance
          </span>
          Comparando {products.length} de {maxCompare}
        </span>
        <div className="md-grow md-row md-wrap" style={{ gap: 8 }}>
          {products.map((p) => (
            <span key={p.id} className="compare-pill">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.images?.[0]} alt={p.name} />
              <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.name}
              </span>
              <button onClick={() => toggleCompare(p)} aria-label={`Quitar ${p.name}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
              </button>
            </span>
          ))}
        </div>
        <button onClick={clearCompare} className="md-btn md-btn-text md-btn-sm md-state">
          Limpiar
        </button>
        <Link
          href="/comparar"
          className={`md-btn md-btn-filled md-btn-sm md-state ${products.length < 2 ? "" : ""}`}
          style={products.length < 2 ? { opacity: 0.5, pointerEvents: "none" } : undefined}
          aria-disabled={products.length < 2}
        >
          Comparar
        </Link>
      </div>
    </div>
  );
}
