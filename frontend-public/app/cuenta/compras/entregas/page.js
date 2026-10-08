"use client";

import { useStore } from "@/context/StoreContext";
import { getOrdersByBuyer } from "@/lib/data";

const steps = ["en preparación", "en camino", "entregado"];

function Progress({ status }) {
  const cancelled = status === "cancelado";
  const current = steps.indexOf(status);
  return (
    <div className="md-row" style={{ gap: 4 }}>
      {steps.map((s, i) => (
        <div
          key={s}
          style={{
            height: 8,
            flex: 1,
            borderRadius: "var(--md-shape-full)",
            background: cancelled
              ? "var(--md-error-container)"
              : i <= current
              ? "var(--md-secondary)"
              : "var(--md-outline-variant)"
          }}
          title={s}
        />
      ))}
    </div>
  );
}

const statusBadge = {
  "en preparación": "md-badge-primary",
  "en camino": "md-badge-primary",
  entregado: "md-badge-secondary",
  cancelado: "md-badge-error"
};

export default function DeliveriesPage() {
  const { user } = useStore();
  const orders = getOrdersByBuyer(user?.id);

  return (
    <div className="md-stack">
      <h2 className="md-title-large" style={{ margin: 0 }}>Estado de entregas</h2>
      {orders.map((o) => (
        <div key={o.id} className="md-card md-card-elevated md-card-pad">
          <div className="md-row-between">
            <p className="md-title-small" style={{ margin: 0 }}>{o.id}</p>
            <span className={`md-badge ${statusBadge[o.status] || "md-badge-neutral"}`} style={{ textTransform: "capitalize" }}>{o.status}</span>
          </div>
          <p className="md-muted md-body-small" style={{ marginTop: 4 }}>
            Tracking: {o.tracking} · {o.shippingAddress}
          </p>
          <div style={{ marginTop: 12 }}>
            <Progress status={o.status} />
            <div className="md-row-between" style={{ marginTop: 4, fontSize: "0.625rem", textTransform: "uppercase", color: "var(--md-on-surface-variant)" }}>
              {steps.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
      {orders.length === 0 && (
        <p className="md-muted md-body-medium">No hay entregas en curso.</p>
      )}
    </div>
  );
}
