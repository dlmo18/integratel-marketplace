"use client";

import { useState } from "react";

export default function DemoForm({ fields, submitLabel = "Enviar", successMessage }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="md-card md-card-elevated md-card-pad md-center">
        <div
          style={{
            margin: "0 auto 12px",
            display: "flex",
            height: 56,
            width: 56,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "var(--md-secondary)",
            color: "var(--md-on-secondary)"
          }}
        >
          <span className="material-symbols-outlined">check</span>
        </div>
        <p className="md-title-medium">
          {successMessage || "¡Formulario enviado correctamente!"}
        </p>
        <p className="md-muted md-body-medium">
          Nos pondremos en contacto contigo pronto. (Demo)
        </p>
        <button onClick={() => setSent(false)} className="md-btn md-btn-outlined md-state" style={{ marginTop: 16 }}>
          Enviar otro
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="md-card md-card-elevated md-card-pad md-stack"
    >
      {fields.map((f) => (
        <div key={f.name}>
          <label className="md-form-label">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea className="md-textarea" rows={4} required={f.required} placeholder={f.placeholder} />
          ) : f.type === "select" ? (
            <select className="md-select" required={f.required}>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input
              type={f.type || "text"}
              className="md-input"
              required={f.required}
              placeholder={f.placeholder}
            />
          )}
        </div>
      ))}
      <button type="submit" className="md-btn md-btn-filled md-btn-block md-state">
        {submitLabel}
      </button>
    </form>
  );
}
