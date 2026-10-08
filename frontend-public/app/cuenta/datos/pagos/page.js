"use client";

import { useStore } from "@/context/StoreContext";

export default function PaymentMethodsPage() {
  const { user } = useStore();
  const methods = user?.paymentMethods || [];

  return (
    <div className="md-stack">
      <div className="md-row-between">
        <h2 className="md-title-large" style={{ margin: 0 }}>Medios de pago</h2>
        <button className="md-btn md-btn-filled md-state">+ Agregar medio</button>
      </div>

      {methods.length === 0 ? (
        <div className="md-card md-card-elevated md-card-pad md-center md-muted">
          No tienes medios de pago registrados.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {methods.map((m) => (
            <div key={m.id} className="md-card md-card-elevated md-card-pad md-row" style={{ gap: 16 }}>
              <span
                className="md-center"
                style={{
                  display: "inline-flex",
                  height: 48,
                  width: 48,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--md-shape-lg)",
                  background: "color-mix(in srgb, var(--md-primary) 12%, transparent)",
                  color: "var(--md-primary)"
                }}
              >
                <span className="material-symbols-outlined">{m.type === "card" ? "credit_card" : "smartphone"}</span>
              </span>
              <div className="md-grow">
                <p className="md-title-small" style={{ margin: 0 }}>
                  {m.brand}
                  {m.last4 ? ` ****${m.last4}` : ""}
                </p>
                <p className="md-muted md-body-small" style={{ margin: 0 }}>
                  {m.type === "card"
                    ? `${m.holder} · Vence ${m.expiry}`
                    : `Billetera · ${m.phone}`}
                </p>
              </div>
              {m.default && (
                <span className="md-badge md-badge-secondary">Predeterminado</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
