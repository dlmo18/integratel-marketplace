"use client";

import { useStore } from "@/context/StoreContext";
import { getReturnsByBuyer } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

const statusColor = {
  aprobada: "bg-movistar-green text-white",
  "en revisión": "bg-yellow-400 text-movistar-navy",
  rechazada: "bg-red-500 text-white"
};

export default function ReturnsStatusPage() {
  const { user } = useStore();
  const returns = getReturnsByBuyer(user?.id);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-movistar-navy">Estado de devoluciones</h2>
      {returns.map((r) => (
        <div key={r.id} className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-movistar-navy">{r.id}</p>
              <p className="text-xs text-movistar-gray-med">
                Pedido {r.orderId} · {formatDate(r.date)}
              </p>
            </div>
            <span className={`badge capitalize ${statusColor[r.status] || "bg-gray-200"}`}>
              {r.status}
            </span>
          </div>
          <p className="mt-2 text-sm"><b>Producto:</b> {r.product}</p>
          <p className="text-sm text-movistar-gray-med"><b>Motivo:</b> {r.reason}</p>
          {r.refund > 0 && (
            <p className="mt-1 text-sm font-semibold text-movistar-green">
              Reembolso: {formatCurrency(r.refund)}
            </p>
          )}
        </div>
      ))}
      {returns.length === 0 && (
        <p className="text-sm text-movistar-gray-med">No tienes devoluciones registradas.</p>
      )}
    </div>
  );
}
