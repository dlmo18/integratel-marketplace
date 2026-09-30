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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-movistar-navy">Gestión de items</h2>
        <button className="btn-green">+ Nuevo producto</button>
      </div>
      <p className="text-sm text-movistar-gray-med">
        Edita stock y precios. Los cambios son locales para la demostración.
      </p>

      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="card flex flex-wrap items-center gap-4 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.image} alt={it.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="min-w-[180px] flex-1">
              <p className="font-semibold text-movistar-navy">{it.name}</p>
              <p className="text-xs uppercase text-movistar-gray-med">{it.category}</p>
            </div>
            <label className="text-xs text-movistar-gray-med">
              Precio (S/)
              <input
                type="number"
                value={it.price}
                onChange={(e) => update(it.id, "price", e.target.value)}
                className="input mt-1 w-28"
              />
            </label>
            <label className="text-xs text-movistar-gray-med">
              Stock
              <input
                type="number"
                value={it.stock}
                onChange={(e) => update(it.id, "stock", e.target.value)}
                className="input mt-1 w-24"
              />
            </label>
            <span className="text-sm font-bold text-movistar-navy">
              {formatCurrency(it.price)}
            </span>
            <span className={`badge ${it.stock > 0 ? "bg-movistar-green text-white" : "bg-red-500 text-white"}`}>
              {it.stock > 0 ? "Disponible" : "Agotado"}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-movistar-gray-med">Aún no publicas productos.</p>
        )}
      </div>
    </div>
  );
}
