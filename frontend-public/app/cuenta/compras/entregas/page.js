"use client";

import { useStore } from "@/context/StoreContext";
import { getOrdersByBuyer } from "@/lib/data";

const steps = ["en preparación", "en camino", "entregado"];

function Progress({ status }) {
  const cancelled = status === "cancelado";
  const current = steps.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`h-2 flex-1 rounded-full ${
            cancelled
              ? "bg-red-200"
              : i <= current
              ? "bg-movistar-green"
              : "bg-gray-200"
          }`}
          title={s}
        />
      ))}
    </div>
  );
}

const statusBadge = {
  "en preparación": "bg-movistar-blue text-white",
  "en camino": "bg-movistar-blue text-white",
  entregado: "bg-movistar-green text-white",
  cancelado: "bg-red-500 text-white"
};

export default function DeliveriesPage() {
  const { user } = useStore();
  const orders = getOrdersByBuyer(user?.id);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-movistar-navy">Estado de entregas</h2>
      {orders.map((o) => (
        <div key={o.id} className="card p-5">
          <div className="flex items-center justify-between">
            <p className="font-bold text-movistar-navy">{o.id}</p>
            <span className={`badge capitalize ${statusBadge[o.status] || "bg-gray-200 text-movistar-navy"}`}>{o.status}</span>
          </div>
          <p className="mt-1 text-xs text-movistar-gray-med">
            Tracking: {o.tracking} · {o.shippingAddress}
          </p>
          <div className="mt-3">
            <Progress status={o.status} />
            <div className="mt-1 flex justify-between text-[10px] uppercase text-movistar-gray-med">
              {steps.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
      {orders.length === 0 && (
        <p className="text-sm text-movistar-gray-med">No hay entregas en curso.</p>
      )}
    </div>
  );
}
