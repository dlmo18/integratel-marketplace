"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/lib/data";
import { formatDate } from "@/lib/format";

function Stars({ value }) {
  const full = Math.round(value);
  return (
    <span style={{ color: "#e8a500" }} aria-label={`${value} de 5 estrellas`}>
      {"★".repeat(full)}
      <span style={{ color: "var(--md-outline-variant)" }}>{"★".repeat(5 - full)}</span>
    </span>
  );
}

export default function MyReviewsPage() {
  const { reviews } = useStore();
  const myReviews = [...(reviews || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="md-stack">
      <div className="md-row-between">
        <h2 className="md-title-large" style={{ margin: 0 }}>Mis reseñas</h2>
        <span className="md-muted md-body-medium">
          {myReviews.length} reseña{myReviews.length === 1 ? "" : "s"}
        </span>
      </div>

      {myReviews.length === 0 ? (
        <div className="md-card md-card-elevated md-card-pad md-center">
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: "var(--md-on-surface-variant)" }}>rate_review</span>
          <p className="md-title-small" style={{ marginTop: 12 }}>Todavía no has escrito reseñas</p>
          <p className="md-muted md-body-medium" style={{ marginTop: 4 }}>
            Valora los productos que compraste desde su ficha para ayudar a otros compradores.
          </p>
          <Link href="/catalogo" className="md-btn md-btn-filled md-state" style={{ marginTop: 20 }}>Ir al catálogo</Link>
        </div>
      ) : (
        <div className="md-stack">
          {myReviews.map((r) => {
            const product = getProductById(r.productId);
            return (
              <article key={r.id} className="md-card md-card-elevated md-card-pad-sm">
                <div className="md-row" style={{ gap: 16, alignItems: "flex-start" }}>
                  {product && (
                    <Link href={`/producto/${product.slug}`} style={{ flexShrink: 0 }} aria-label={product.name}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.images?.[0]} alt={product.name} style={{ height: 64, width: 64, borderRadius: "var(--md-shape-sm)", objectFit: "cover" }} />
                    </Link>
                  )}
                  <div className="md-grow" style={{ minWidth: 0 }}>
                    <div className="md-row-between md-wrap">
                      {product ? (
                        <Link href={`/producto/${product.slug}`} className="md-title-small">{product.name}</Link>
                      ) : (
                        <span className="md-title-small">Producto</span>
                      )}
                      <time className="md-muted" style={{ fontSize: "0.75rem" }}>{formatDate(r.date)}</time>
                    </div>
                    <div style={{ marginTop: 2 }}><Stars value={r.rating} /></div>
                    {r.title && <p className="md-title-small" style={{ margin: "8px 0 0" }}>{r.title}</p>}
                    <p className="md-muted md-body-medium" style={{ marginTop: 4 }}>{r.comment}</p>
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
