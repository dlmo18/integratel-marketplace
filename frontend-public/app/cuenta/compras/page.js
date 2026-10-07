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
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-movistar-navy">Dashboard de compras</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pedidos" value={orders.length} icon="📦" />
        <StatCard label="Entregados" value={delivered} icon="✅" accent="green" />
        <StatCard label="Total gastado" value={formatCurrency(totalSpent)} icon="💰" accent="navy" />
        <StatCard label="Devoluciones" value={returns.length} icon="↩️" />
      </div>

      <div className="card p-6">
        <h3 className="mb-4 font-bold text-movistar-navy">Últimos pedidos</h3>
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between rounded-lg bg-movistar-gray p-3 text-sm">
              <div>
                <p className="font-semibold text-movistar-navy">{o.id}</p>
                <p className="text-movistar-gray-med">{o.date}</p>
              </div>
              <span className="badge bg-movistar-blue text-white capitalize">{o.status}</span>
              <span className="font-bold">{formatCurrency(o.total)}</span>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-sm text-movistar-gray-med">Aún no tienes pedidos.</p>
          )}
        </div>
      </div>
    </div>
  );
}
