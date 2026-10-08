"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

// Carrusel de productos vistos recientemente (store.recent).
export default function RecentlyViewed({ excludeId, title = "Vistos recientemente" }) {
  const { recent } = useStore();

  const products = (recent || [])
    .filter((id) => id !== excludeId)
    .map((id) => getProductById(id))
    .filter(Boolean);

  if (products.length === 0) return null;

  return (
    <section className="md-section">
      <div className="md-container">
        <h2 className="md-headline-medium" style={{ marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span className="material-symbols-outlined">history</span>
          {title}
        </h2>
        <div className="recent-scroller">
          {products.map((p) => (
            <Link key={p.id} href={`/producto/${p.slug}`} className="md-card md-card-elevated pcard recent-card md-state">
              <div className="pcard-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images?.[0]} alt={p.name} />
              </div>
              <div className="pcard-body">
                <span className="pcard-brand">{p.brand}</span>
                <span className="pcard-name">{p.name}</span>
                <span className="pcard-price" style={{ marginTop: 8 }}>
                  {formatCurrency(p.price, p.currency)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
