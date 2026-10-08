"use client";

import { useStore } from "@/context/StoreContext";
import { getOrdersByBuyer } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

export default function PurchaseHistory() {
  const { user } = useStore();
  const orders = getOrdersByBuyer(user?.id);

  return (
    <div className="md-stack">
      <h2 className="md-title-large" style={{ margin: 0 }}>Historial de compras</h2>
      {orders.map((o) => (
        <div key={o.id} className="md-card md-card-elevated md-card-pad">
          <div className="md-row-between md-wrap" style={{ gap: 8, borderBottom: "1px solid var(--md-outline-variant)", paddingBottom: 12 }}>
            <div>
              <p className="md-title-small" style={{ margin: 0 }}>{o.id}</p>
              <p className="md-muted md-body-small" style={{ margin: 0 }}>{formatDate(o.date)}</p>
            </div>
            <span className="md-badge md-badge-primary" style={{ textTransform: "capitalize" }}>{o.status}</span>
          </div>
          <ul className="md-stack" style={{ listStyle: "none", margin: "12px 0 0", padding: 0, gap: 8 }}>
            {o.items.map((it, i) => (
              <li key={i} className="md-row-between md-body-medium">
                <span>{it.qty}× {it.name}</span>
                <span>{formatCurrency(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="md-row-between md-body-medium" style={{ marginTop: 12, borderTop: "1px solid var(--md-outline-variant)", paddingTop: 12 }}>
            <span className="md-muted">Pago: {o.paymentMethod}</span>
            <span style={{ fontWeight: 700 }}>Total: {formatCurrency(o.total)}</span>
          </div>
        </div>
      ))}
      {orders.length === 0 && (
        <p className="md-muted md-body-medium">No hay compras registradas.</p>
      )}
    </div>
  );
}
