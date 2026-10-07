"use client";

import { useStore } from "@/context/StoreContext";
import { getSalesBySeller } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import SellerOnly from "@/components/SellerOnly";

export default function SalesHistory() {
  const { user } = useStore();
  return (
    <SellerOnly>
      <List userId={user?.id} />
    </SellerOnly>
  );
}

function List({ userId }) {
  const sales = getSalesBySeller(userId);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-movistar-navy">Historial de ventas</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-movistar-gray text-movistar-navy">
            <tr>
              <th className="p-3">Venta</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Payout</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-semibold">{s.id}</td>
                <td className="p-3">{s.buyerName}</td>
                <td className="p-3">{formatDate(s.date)}</td>
                <td className="p-3 capitalize">{s.status}</td>
                <td className="p-3 capitalize">{s.payout}</td>
                <td className="p-3 text-right font-bold">{formatCurrency(s.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
