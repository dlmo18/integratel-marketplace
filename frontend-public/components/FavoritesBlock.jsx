"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

// Bloque "Tus Favoritos" (mini-tarjetas). Solo si hay favoritos guardados.
export default function FavoritesBlock({ limit = 6 }) {
  const { favorites, addToCart, toggleFavorite } = useStore();

  const products = (favorites || [])
    .map((id) => getProductById(id))
    .filter(Boolean)
    .slice(0, limit);

  if (products.length === 0) return null;

  return (
    <section className="md-section">
      <div className="md-container">
        <div className="section-head">
          <h2 className="md-headline-medium" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span className="material-symbols-outlined filled" style={{ color: "var(--md-error)" }}>favorite</span>
            Tus Favoritos
          </h2>
          <Link href="/cuenta/favoritos" className="section-link">
            Ver lista de deseos →
          </Link>
        </div>
        <div className="prod-grid-6">
          {products.map((p) => {
            const outOfStock = p.stock <= 0;
            return (
              <article key={p.id} className="md-card md-card-elevated pcard">
                <div className="pcard-media">
                  <Link href={`/producto/${p.slug}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images?.[0]} alt={p.name} className={outOfStock ? "out" : ""} loading="lazy" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(p)}
                    className="pcard-fav on md-state"
                    aria-label="Quitar de favoritos"
                  >
                    <span className="material-symbols-outlined filled" style={{ fontSize: 18 }}>favorite</span>
                  </button>
                </div>
                <div className="pcard-body" style={{ padding: 12 }}>
                  <Link href={`/producto/${p.slug}`} className="pcard-name">{p.name}</Link>
                  <p className="pcard-price" style={{ marginTop: 8 }}>
                    {formatCurrency(p.price, p.currency)}
                  </p>
                  <button
                    onClick={() => addToCart(p, 1)}
                    disabled={outOfStock}
                    className={`md-btn md-btn-sm md-state ${outOfStock ? "md-btn-outlined" : "md-btn-filled"}`}
                    style={{ marginTop: 8, width: "100%" }}
                  >
                    {outOfStock ? "Agotado" : "Agregar"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
