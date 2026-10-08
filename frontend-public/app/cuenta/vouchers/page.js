"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getVouchersByUser } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

const statusStyle = {
  activo: "md-badge-secondary",
  usado: "md-badge-neutral",
  expirado: "md-badge-error"
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
    <div className="md-stack">
      <div className="md-row-between">
        <h2 className="md-title-large" style={{ margin: 0 }}>Mis vouchers</h2>
        <Link href="/cuenta/puntos" className="md-primary-text md-title-small md-row" style={{ gap: 4 }}>
          <span className="material-symbols-outlined filled" style={{ fontSize: 18 }}>star</span> Canjear puntos
        </Link>
      </div>

      <p className="md-muted md-body-medium">
        Tienes <b style={{ color: "var(--md-on-surface)" }}>{active.length}</b> voucher(s)
        activo(s). Úsalos en el carrito ingresando su código.
      </p>

      {vouchers.length === 0 ? (
        <div className="md-card md-card-elevated md-card-pad md-center md-muted">
          Todavía no tienes vouchers. Canjea tus puntos para generar uno.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {vouchers.map((v) => (
            <div
              key={v.id}
              className="md-card md-card-elevated md-card-pad"
              style={{ position: "relative", opacity: v.status !== "activo" ? 0.7 : 1 }}
            >
              {/* Muesca de ticket */}
              <div style={{ position: "absolute", left: -12, top: "50%", height: 24, width: 24, transform: "translateY(-50%)", borderRadius: "var(--md-shape-full)", background: "var(--md-surface-container)" }} />
              <div style={{ position: "absolute", right: -12, top: "50%", height: 24, width: 24, transform: "translateY(-50%)", borderRadius: "var(--md-shape-full)", background: "var(--md-surface-container)" }} />

              <div className="md-row-between" style={{ alignItems: "flex-start" }}>
                <div>
                  <p className="md-muted md-body-small" style={{ margin: 0, textTransform: "uppercase" }}>
                    {v.source}
                  </p>
                  <p className="md-title-medium" style={{ marginTop: 4, fontWeight: 700 }}>
                    {discountLabel(v)}
                  </p>
                </div>
                <span className={`md-badge ${statusStyle[v.status] || "md-badge-neutral"}`} style={{ textTransform: "capitalize" }}>
                  {v.status}
                </span>
              </div>

              <div className="md-row-between" style={{ marginTop: 16, borderRadius: "var(--md-shape-md)", border: "2px dashed color-mix(in srgb, var(--md-primary) 40%, transparent)", background: "color-mix(in srgb, var(--md-primary) 5%, transparent)", padding: "8px 12px" }}>
                <span style={{ fontFamily: "monospace", fontSize: "1.125rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                  {v.code}
                </span>
                <button
                  onClick={() => navigator.clipboard?.writeText(v.code)}
                  className="md-btn md-btn-text md-btn-sm md-state"
                >
                  Copiar
                </button>
              </div>

              <div className="md-row-between md-muted md-body-small" style={{ marginTop: 12 }}>
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
