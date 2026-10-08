"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { getSellerProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import SellerOnly from "@/components/SellerOnly";

export default function ItemsPage() {
  const { user } = useStore();
  return (
    <SellerOnly>
      <Manager userId={user?.id} />
    </SellerOnly>
  );
}

function Manager({ userId }) {
  const [items, setItems] = useState(() =>
    getSellerProducts(userId).map((p) => ({
      id: p.id,
      name: p.name,
      image: p.images?.[0],
      price: p.price,
      stock: p.stock,
      category: p.category
    }))
  );

  const update = (id, field, value) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: Number(value) } : it))
    );

  return (
    <div className="md-stack">
      <div className="md-row-between">
        <h2 className="md-title-large" style={{ margin: 0 }}>Gestión de items</h2>
        <button className="md-btn md-btn-green md-state">+ Nuevo producto</button>
      </div>
      <p className="md-muted md-body-medium">
        Edita stock y precios. Los cambios son locales para la demostración.
      </p>

      <div className="md-stack" style={{ gap: 12 }}>
        {items.map((it) => (
          <div key={it.id} className="md-card md-card-elevated md-card-pad-sm md-row md-wrap" style={{ gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.image} alt={it.name} style={{ height: 64, width: 64, borderRadius: "var(--md-shape-md)", objectFit: "cover" }} />
            <div className="md-grow" style={{ minWidth: 180 }}>
              <p className="md-title-small" style={{ margin: 0 }}>{it.name}</p>
              <p className="md-muted md-body-small" style={{ margin: 0, textTransform: "uppercase" }}>{it.category}</p>
            </div>
            <label className="md-muted md-body-small">
              Precio (S/)
              <input
                type="number"
                value={it.price}
                onChange={(e) => update(it.id, "price", e.target.value)}
                className="md-input"
                style={{ marginTop: 4, width: 112 }}
              />
            </label>
            <label className="md-muted md-body-small">
              Stock
              <input
                type="number"
                value={it.stock}
                onChange={(e) => update(it.id, "stock", e.target.value)}
                className="md-input"
                style={{ marginTop: 4, width: 96 }}
              />
            </label>
            <span className="md-title-small">
              {formatCurrency(it.price)}
            </span>
            <span className={`md-badge ${it.stock > 0 ? "md-badge-secondary" : "md-badge-error"}`}>
              {it.stock > 0 ? "Disponible" : "Agotado"}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="md-muted md-body-medium">Aún no publicas productos.</p>
        )}
      </div>
    </div>
  );
}
