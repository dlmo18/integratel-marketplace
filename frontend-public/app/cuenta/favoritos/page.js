"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default function WishlistPage() {
  const { favorites, toggleFavorite, addToCart } = useStore();

  const products = (favorites || []).map((id) => getProductById(id)).filter(Boolean);

  return (
    <div className="md-stack">
      <div className="md-row-between">
        <h2 className="md-title-large" style={{ margin: 0 }}>Lista de deseos</h2>
        <span className="md-muted md-body-medium">
          {products.length} producto{products.length === 1 ? "" : "s"}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="md-card md-card-elevated md-card-pad md-center">
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: "var(--md-on-surface-variant)" }}>favorite</span>
          <p className="md-title-small" style={{ marginTop: 12 }}>Aún no tienes favoritos</p>
          <p className="md-muted md-body-medium" style={{ marginTop: 4 }}>
            Pulsa el corazón en cualquier producto para guardarlo aquí.
          </p>
          <Link href="/catalogo" className="md-btn md-btn-filled md-state" style={{ marginTop: 20 }}>Explorar catálogo</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {products.map((p) => {
            const outOfStock = p.stock <= 0;
            const discount = p.listPrice > p.price ? Math.round((1 - p.price / p.listPrice) * 100) : 0;
            return (
              <div key={p.id} className="md-card md-card-elevated md-card-pad-sm md-row" style={{ gap: 16, alignItems: "stretch" }}>
                <Link href={`/producto/${p.slug}`} style={{ flexShrink: 0 }} aria-label={p.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images?.[0]} alt={p.name} style={{ height: 96, width: 96, borderRadius: "var(--md-shape-md)", objectFit: "cover", filter: outOfStock ? "grayscale(1)" : "none", opacity: outOfStock ? 0.6 : 1 }} />
                </Link>
                <div className="md-grow md-col" style={{ minWidth: 0, gap: 0 }}>
                  <span className="pcard-brand">{p.brand}</span>
                  <Link href={`/producto/${p.slug}`} className="pcard-name">{p.name}</Link>
                  <div className="md-row" style={{ gap: 8, alignItems: "baseline", marginTop: 4 }}>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(p.price, p.currency)}</span>
                    {discount > 0 && <span className="md-muted md-strike" style={{ fontSize: "0.75rem" }}>{formatCurrency(p.listPrice, p.currency)}</span>}
                  </div>
                  <div className="md-row" style={{ gap: 8, marginTop: "auto", paddingTop: 12 }}>
                    <button onClick={() => addToCart(p, 1)} disabled={outOfStock} className={`md-btn md-btn-sm md-state ${outOfStock ? "md-btn-outlined" : "md-btn-filled"}`}>
                      {outOfStock ? "Agotado" : "Agregar al carrito"}
                    </button>
                    <button onClick={() => toggleFavorite(p)} className="md-btn md-btn-outlined md-btn-sm md-state" style={{ color: "var(--md-error)" }}>Quitar</button>
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
