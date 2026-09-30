"use client";

import { useStore } from "@/context/StoreContext";
import { getTransactionsBySeller } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import SellerOnly from "@/components/SellerOnly";

export default function TransactionsPage() {
  const { user } = useStore();
  return (
    <SellerOnly>
      <List userId={user?.id} />
    </SellerOnly>
  );
}

function List({ userId }) {
  const txns = getTransactionsBySeller(userId);
  const net = txns.reduce((a, t) => a + t.net, 0);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-movistar-navy">Transacciones de pago</h2>
      <div className="card p-4 text-sm">
        Total neto acumulado:{" "}
        <span className="font-bold text-movistar-green">{formatCurrency(net)}</span>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-movistar-gray text-movistar-navy">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Venta</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Método</th>
              <th className="p-3 text-right">Monto</th>
              <th className="p-3 text-right">Comisión</th>
              <th className="p-3 text-right">Neto</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-3 font-semibold">{t.id}</td>
                <td className="p-3">{t.saleId}</td>
                <td className="p-3">{formatDate(t.date)}</td>
                <td className="p-3">{t.method}</td>
                <td className="p-3 text-right">{formatCurrency(t.amount)}</td>
                <td className="p-3 text-right text-red-500">-{formatCurrency(t.fee)}</td>
                <td className="p-3 text-right font-bold">{formatCurrency(t.net)}</td>
                <td className="p-3">
                  <span className={`badge capitalize ${t.status === "abonado" ? "bg-movistar-green text-white" : "bg-yellow-400 text-movistar-navy"}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
