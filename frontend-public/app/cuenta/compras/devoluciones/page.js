"use client";

import { useStore } from "@/context/StoreContext";
import { getReturnsByBuyer } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

const statusColor = {
  aprobada: "md-badge-secondary",
  "en revisión": "md-badge-primary-container",
  rechazada: "md-badge-error"
};

export default function ReturnsStatusPage() {
  const { user } = useStore();
  const returns = getReturnsByBuyer(user?.id);

  return (
    <div className="md-stack">
      <h2 className="md-title-large" style={{ margin: 0 }}>Estado de devoluciones</h2>
      {returns.map((r) => (
        <div key={r.id} className="md-card md-card-elevated md-card-pad">
          <div className="md-row-between">
            <div>
              <p className="md-title-small" style={{ margin: 0 }}>{r.id}</p>
              <p className="md-muted md-body-small" style={{ margin: 0 }}>
                Pedido {r.orderId} · {formatDate(r.date)}
              </p>
            </div>
            <span className={`md-badge ${statusColor[r.status] || "md-badge-neutral"}`} style={{ textTransform: "capitalize" }}>
              {r.status}
            </span>
          </div>
          <p className="md-body-medium" style={{ marginTop: 8 }}><b>Producto:</b> {r.product}</p>
          <p className="md-muted md-body-medium" style={{ margin: 0 }}><b>Motivo:</b> {r.reason}</p>
          {r.refund > 0 && (
            <p className="md-body-medium" style={{ marginTop: 4, fontWeight: 600, color: "var(--md-secondary)" }}>
              Reembolso: {formatCurrency(r.refund)}
            </p>
          )}
        </div>
      ))}
      {returns.length === 0 && (
        <p className="md-muted md-body-medium">No tienes devoluciones registradas.</p>
      )}
    </div>
  );
}
