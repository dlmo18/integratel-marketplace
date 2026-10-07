"use client";

import { useStore } from "@/context/StoreContext";
import { getOrdersByBuyer } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

export default function PurchaseHistory() {
  const { user } = useStore();
  const orders = getOrdersByBuyer(user?.id);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-movistar-navy">Historial de compras</h2>
      {orders.map((o) => (
        <div key={o.id} className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div>
              <p className="font-bold text-movistar-navy">{o.id}</p>
              <p className="text-xs text-movistar-gray-med">{formatDate(o.date)}</p>
            </div>
            <span className="badge bg-movistar-blue text-white capitalize">{o.status}</span>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {o.items.map((it, i) => (
              <li key={i} className="flex justify-between">
                <span>{it.qty}× {it.name}</span>
                <span>{formatCurrency(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t pt-3 text-sm">
            <span className="text-movistar-gray-med">Pago: {o.paymentMethod}</span>
            <span className="font-bold text-movistar-navy">Total: {formatCurrency(o.total)}</span>
          </div>
        </div>
      ))}
      {orders.length === 0 && (
        <p className="text-sm text-movistar-gray-med">No hay compras registradas.</p>
      )}
    </div>
  );
}
