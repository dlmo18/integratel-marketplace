"use client";

import { useStore } from "@/context/StoreContext";

export default function PaymentMethodsPage() {
  const { user } = useStore();
  const methods = user?.paymentMethods || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-movistar-navy">Medios de pago</h2>
        <button className="btn-primary">+ Agregar medio</button>
      </div>

      {methods.length === 0 ? (
        <div className="card p-8 text-center text-movistar-gray-med">
          No tienes medios de pago registrados.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {methods.map((m) => (
            <div key={m.id} className="card flex items-center gap-4 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-movistar-blue/10 text-2xl">
                {m.type === "card" ? "💳" : "📲"}
              </span>
              <div className="flex-1">
                <p className="font-bold text-movistar-navy">
                  {m.brand}
                  {m.last4 ? ` ****${m.last4}` : ""}
                </p>
                <p className="text-xs text-movistar-gray-med">
                  {m.type === "card"
                    ? `${m.holder} · Vence ${m.expiry}`
                    : `Billetera · ${m.phone}`}
                </p>
              </div>
              {m.default && (
                <span className="badge bg-movistar-green text-white">Predeterminado</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
