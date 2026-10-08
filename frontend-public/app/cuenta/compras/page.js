"use client";

import { useStore } from "@/context/StoreContext";
import { getOrdersByBuyer, getReturnsByBuyer } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import StatCard from "@/components/StatCard";

export default function PurchasesDashboard() {
  const { user } = useStore();
  const orders = getOrdersByBuyer(user?.id) ;
  const returns = getReturnsByBuyer(user?.id);
  const totalSpent = orders.reduce((a, o) => a + o.total, 0);
  const delivered = orders.filter((o) => o.status === "entregado").length;

  return (
    <div className="md-stack">
      <h2 className="md-title-large" style={{ margin: 0 }}>Dashboard de compras</h2>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <StatCard label="Pedidos" value={orders.length} icon={<span className="material-symbols-outlined">inventory_2</span>} />
        <StatCard label="Entregados" value={delivered} icon={<span className="material-symbols-outlined">check_circle</span>} accent="secondary" />
        <StatCard label="Total gastado" value={formatCurrency(totalSpent)} icon={<span className="material-symbols-outlined">payments</span>} accent="primary" />
        <StatCard label="Devoluciones" value={returns.length} icon={<span className="material-symbols-outlined">keyboard_return</span>} />
      </div>

      <div className="md-card md-card-elevated md-card-pad">
        <h3 className="md-title-medium" style={{ margin: "0 0 16px" }}>Últimos pedidos</h3>
        <div className="md-stack" style={{ gap: 12 }}>
          {orders.map((o) => (
            <div key={o.id} className="md-row-between" style={{ borderRadius: "var(--md-shape-md)", background: "var(--md-surface-container)", padding: 12 }}>
              <div>
                <p className="md-title-small" style={{ margin: 0 }}>{o.id}</p>
                <p className="md-muted md-body-small" style={{ margin: 0 }}>{o.date}</p>
              </div>
              <span className="md-badge md-badge-primary" style={{ textTransform: "capitalize" }}>{o.status}</span>
              <span style={{ fontWeight: 700 }}>{formatCurrency(o.total)}</span>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="md-muted md-body-medium">Aún no tienes pedidos.</p>
          )}
        </div>
      </div>
    </div>
  );
}
