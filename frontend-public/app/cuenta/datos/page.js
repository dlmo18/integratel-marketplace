"use client";

import { useStore } from "@/context/StoreContext";

export default function PersonalDataPage() {
  const { user } = useStore();

  return (
    <div className="md-stack">
      <h2 className="md-title-large" style={{ margin: 0 }}>Datos personales</h2>
      <div className="md-card md-card-elevated md-card-pad">
        <div className="md-row" style={{ gap: 16, borderBottom: "1px solid var(--md-outline-variant)", paddingBottom: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div>
            <p className="md-title-small" style={{ margin: 0 }}>{user?.name}</p>
            <p className="md-muted md-body-medium" style={{ margin: 0, textTransform: "capitalize" }}>
              {user?.type === "seller" ? "Cuenta Seller" : "Cuenta Comprador"}
            </p>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div>
            <label className="md-form-label">Nombre completo</label>
            <input className="md-input" defaultValue={user?.name} />
          </div>
          <div>
            <label className="md-form-label">Correo electrónico</label>
            <input className="md-input" defaultValue={user?.email} />
          </div>
          <div>
            <label className="md-form-label">Teléfono</label>
            <input className="md-input" defaultValue={user?.phone || ""} placeholder="+51 9XX XXX XXX" />
          </div>
          {user?.type === "seller" && (
            <>
              <div>
                <label className="md-form-label">Nombre de tienda</label>
                <input className="md-input" defaultValue={user?.storeName || ""} />
              </div>
              <div>
                <label className="md-form-label">RUC</label>
                <input className="md-input" defaultValue={user?.ruc || ""} />
              </div>
            </>
          )}
        </div>
        <button className="md-btn md-btn-filled md-state" style={{ marginTop: 16 }}>Guardar cambios</button>
      </div>
    </div>
  );
}
