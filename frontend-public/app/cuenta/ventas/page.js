"use client";

import { useStore } from "@/context/StoreContext";
import { getSalesBySeller, getSellerProducts, getTransactionsBySeller } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import StatCard from "@/components/StatCard";
import SellerOnly from "@/components/SellerOnly";

export default function SalesDashboard() {
  const { user } = useStore();

  return (
    <SellerOnly>
      <Content userId={user?.id} />
    </SellerOnly>
  );
}

function Content({ userId }) {
  const sales = getSalesBySeller(userId);
  const products = getSellerProducts(userId);
  const txns = getTransactionsBySeller(userId);
  const revenue = sales.reduce((a, s) => a + s.total, 0);
  const pending = txns.filter((t) => t.status === "pendiente").length;

  return (
    <div className="md-stack">
      <h2 className="md-title-large" style={{ margin: 0 }}>Dashboard de ventas</h2>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <StatCard label="Ventas" value={sales.length} icon={<span className="material-symbols-outlined">receipt_long</span>} />
        <StatCard label="Ingresos" value={formatCurrency(revenue)} icon={<span className="material-symbols-outlined">payments</span>} accent="secondary" />
        <StatCard label="Productos" value={products.length} icon={<span className="material-symbols-outlined">inventory_2</span>} accent="primary" />
        <StatCard label="Pagos pendientes" value={pending} icon={<span className="material-symbols-outlined">hourglass_top</span>} />
      </div>

      <div className="md-card md-card-elevated md-card-pad">
        <h3 className="md-title-medium" style={{ margin: "0 0 16px" }}>Ventas recientes</h3>
        <div className="md-stack" style={{ gap: 12 }}>
          {sales.map((s) => (
            <div key={s.id} className="md-row-between" style={{ borderRadius: "var(--md-shape-md)", background: "var(--md-surface-container)", padding: 12 }}>
              <div>
                <p className="md-title-small" style={{ margin: 0 }}>{s.id}</p>
                <p className="md-muted md-body-small" style={{ margin: 0 }}>{s.buyerName} · {s.date}</p>
              </div>
              <span className="md-badge md-badge-primary" style={{ textTransform: "capitalize" }}>{s.status}</span>
              <span style={{ fontWeight: 700 }}>{formatCurrency(s.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
