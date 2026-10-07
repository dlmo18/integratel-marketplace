"use client";

import { useState } from "react";

export default function DemoForm({ fields, submitLabel = "Enviar", successMessage }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-movistar-green text-2xl text-white">
          ✓
        </div>
        <p className="font-semibold text-movistar-navy">
          {successMessage || "¡Formulario enviado correctamente!"}
        </p>
        <p className="text-sm text-movistar-gray-med">
          Nos pondremos en contacto contigo pronto. (Demo)
        </p>
        <button onClick={() => setSent(false)} className="btn-outline mt-4">
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
      className="card space-y-4 p-6"
    >
      {fields.map((f) => (
        <label key={f.name} className="block text-sm font-medium text-movistar-navy">
          {f.label}
          {f.type === "textarea" ? (
            <textarea className="input mt-1" rows={4} required={f.required} placeholder={f.placeholder} />
          ) : f.type === "select" ? (
            <select className="input mt-1" required={f.required}>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input
              type={f.type || "text"}
              className="input mt-1"
              required={f.required}
              placeholder={f.placeholder}
            />
          )}
        </label>
      ))}
      <button type="submit" className="btn-primary w-full">
        {submitLabel}
      </button>
    </form>
  );
}
