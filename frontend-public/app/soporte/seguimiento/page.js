"use client";

import { useState } from "react";
import orders from "@/data/orders.json";

const steps = ["en preparación", "en camino", "entregado"];

export default function TrackingPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const search = (e) => {
    e.preventDefault();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === code.trim().toLowerCase() ||
        o.tracking.toLowerCase() === code.trim().toLowerCase()
    );
    if (found) {
      setResult(found);
      setError("");
    } else {
      setResult(null);
      setError("No encontramos un pedido con ese código. Prueba con ORD-2026-0001 o TRK-889201.");
    }
  };

  const currentStep = result ? steps.indexOf(result.status) : -1;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-3 text-2xl font-bold text-movistar-navy">
        Seguimiento de pedidos
      </h1>
      <p className="mb-6 text-movistar-gray-med">
        Ingresa tu número de pedido o código de tracking. Demo: prueba
        <b> ORD-2026-0001</b>.
      </p>

      <form onSubmit={search} className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ORD-2026-0001 / TRK-889201"
          className="input"
        />
        <button type="submit" className="btn-primary px-6">
          Buscar
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {result && (
        <div className="card mt-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-movistar-navy">{result.id}</p>
              <p className="text-sm text-movistar-gray-med">
                Tracking: {result.tracking}
              </p>
            </div>
            <span className="badge bg-movistar-blue text-white capitalize">
              {result.status}
            </span>
          </div>

          <div className="mt-6 flex items-center">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {i > 0 && (
                    <div
                      className={`h-1 flex-1 ${
                        i <= currentStep ? "bg-movistar-green" : "bg-gray-200"
                      }`}
                    />
                  )}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs text-white ${
                      i <= currentStep ? "bg-movistar-green" : "bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 ${
                        i < currentStep ? "bg-movistar-green" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <span className="mt-2 text-center text-xs capitalize">{s}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 text-sm text-movistar-gray-med">
            <p><b>Dirección:</b> {result.shippingAddress}</p>
            <p><b>Fecha:</b> {result.date}</p>
          </div>
        </div>
      )}
    </div>
  );
}
