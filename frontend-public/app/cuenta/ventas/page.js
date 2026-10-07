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
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-movistar-navy">Dashboard de ventas</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Ventas" value={sales.length} icon="🧾" />
        <StatCard label="Ingresos" value={formatCurrency(revenue)} icon="💰" accent="green" />
        <StatCard label="Productos" value={products.length} icon="📦" accent="navy" />
        <StatCard label="Pagos pendientes" value={pending} icon="⏳" />
      </div>

      <div className="card p-6">
        <h3 className="mb-4 font-bold text-movistar-navy">Ventas recientes</h3>
        <div className="space-y-3">
          {sales.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg bg-movistar-gray p-3 text-sm">
              <div>
                <p className="font-semibold text-movistar-navy">{s.id}</p>
                <p className="text-movistar-gray-med">{s.buyerName} · {s.date}</p>
              </div>
              <span className="badge bg-movistar-blue text-white capitalize">{s.status}</span>
              <span className="font-bold">{formatCurrency(s.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
