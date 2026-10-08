"use client";

import { useStore } from "@/context/StoreContext";

export default function AddressesPage() {
  const { user } = useStore();
  const addresses = user?.addresses || [];

  return (
    <div className="md-stack">
      <div className="md-row-between">
        <h2 className="md-title-large" style={{ margin: 0 }}>Direcciones</h2>
        <button className="md-btn md-btn-filled md-state">+ Agregar dirección</button>
      </div>

      {addresses.length === 0 ? (
        <div className="md-card md-card-elevated md-card-pad md-center md-muted">
          No tienes direcciones registradas.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {addresses.map((a) => (
            <div key={a.id} className="md-card md-card-elevated md-card-pad">
              <div className="md-row-between">
                <p className="md-title-small" style={{ margin: 0 }}>{a.alias}</p>
                {a.default && (
                  <span className="md-badge md-badge-primary">Principal</span>
                )}
              </div>
              <p className="md-muted md-body-medium" style={{ marginTop: 8 }}>
                {a.line1}
                <br />
                {a.district}, {a.city}
                <br />
                {a.region} · {a.zip}
              </p>
              <div className="md-row md-body-medium" style={{ marginTop: 12, gap: 12 }}>
                <button className="md-btn md-btn-text md-btn-sm md-state">Editar</button>
                <button className="md-btn md-btn-text md-btn-sm md-state" style={{ color: "var(--md-error)" }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
