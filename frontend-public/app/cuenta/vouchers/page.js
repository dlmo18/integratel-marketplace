"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getVouchersByUser } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

const statusStyle = {
  activo: "bg-movistar-green text-white",
  usado: "bg-gray-300 text-movistar-navy",
  expirado: "bg-red-500 text-white"
};

function discountLabel(v) {
  return v.discountType === "percent"
    ? `${v.value}% de descuento`
    : `${formatCurrency(v.value)} de descuento`;
}

export default function VouchersPage() {
  const { user } = useStore();
  const vouchers = useMemo(() => getVouchersByUser(user), [user]);

  const active = vouchers.filter((v) => v.status === "activo");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-movistar-navy">Mis vouchers</h2>
        <Link href="/cuenta/puntos" className="text-sm font-semibold text-movistar-blue hover:underline">
          ⭐ Canjear puntos
        </Link>
      </div>

      <p className="text-sm text-movistar-gray-med">
        Tienes <b className="text-movistar-navy">{active.length}</b> voucher(s)
        activo(s). Úsalos en el carrito ingresando su código.
      </p>

      {vouchers.length === 0 ? (
        <div className="card p-10 text-center text-movistar-gray-med">
          Todavía no tienes vouchers. Canjea tus puntos para generar uno.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {vouchers.map((v) => (
            <div
              key={v.id}
              className={`card relative overflow-hidden p-5 ${
                v.status !== "activo" ? "opacity-70" : ""
              }`}
            >
              {/* Muesca de ticket */}
              <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-movistar-gray" />
              <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-movistar-gray" />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase text-movistar-gray-med">
                    {v.source}
                  </p>
                  <p className="mt-1 text-lg font-bold text-movistar-navy">
                    {discountLabel(v)}
                  </p>
                </div>
                <span className={`badge capitalize ${statusStyle[v.status] || "bg-gray-200"}`}>
                  {v.status}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg border-2 border-dashed border-movistar-blue/40 bg-movistar-blue/5 px-3 py-2">
                <span className="font-mono text-lg font-bold tracking-wider text-movistar-navy">
                  {v.code}
                </span>
                <button
                  onClick={() => navigator.clipboard?.writeText(v.code)}
                  className="text-xs font-semibold text-movistar-blue hover:underline"
                >
                  Copiar
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-movistar-gray-med">
                <span>Compra mínima: {formatCurrency(v.minPurchase)}</span>
                <span>Vence: {formatDate(v.expiry)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
