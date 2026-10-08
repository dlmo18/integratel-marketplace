"use client";

import { useEffect, useState } from "react";
import orders from "@/data/orders.json";

const steps = ["en preparación", "en camino", "entregado"];

const demoCodes = [
  { code: "ORD-2026-0003", status: "en preparación" },
  { code: "ORD-2026-0002", status: "en camino" },
  { code: "ORD-2026-0001", status: "entregado" }
];

const progressFor = (status) => {
  switch (status) {
    case "en preparación": return 0.08;
    case "en camino": return 0.52;
    case "entregado": return 1;
    case "cancelado": return 0;
    default: return 0;
  }
};

const locationLabel = (status) => {
  switch (status) {
    case "en preparación": return "En el centro de distribución · preparando tu paquete";
    case "en camino": return "En ruta de reparto · acercándose a tu dirección";
    case "entregado": return "Entregado en tu dirección";
    case "cancelado": return "Pedido cancelado";
    default: return "Ubicación no disponible";
  }
};

const pointOnPath = (t) => {
  const p0 = { x: 40, y: 180 };
  const p1 = { x: 200, y: 40 };
  const p2 = { x: 360, y: 150 };
  const mt = 1 - t;
  const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
  const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;
  return { x, y };
};

function OrderMap({ status }) {
  const target = progressFor(status);
  const [t, setT] = useState(0);

  useEffect(() => {
    setT(0);
    let raf;
    const start = performance.now();
    const duration = 1200;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setT(eased * target);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const pos = pointOnPath(t);

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--md-shape-md)", border: "1px solid var(--md-outline-variant)", background: "#eef3fb" }}>
      <svg viewBox="0 0 400 220" style={{ height: 224, width: "100%" }}>
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#d4ddee" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="220" fill="url(#grid)" />
        <path d="M0 70 H400" stroke="#cdd8ec" strokeWidth="6" />
        <path d="M110 0 V220" stroke="#cdd8ec" strokeWidth="6" />
        <path d="M280 0 V220" stroke="#cdd8ec" strokeWidth="4" />
        <path d="M40 180 Q200 40 360 150" fill="none" stroke="#9db4de" strokeWidth="3" strokeDasharray="6 6" />
        <path d="M40 180 Q200 40 360 150" fill="none" stroke="var(--md-secondary)" strokeWidth="4" strokeDasharray="500" strokeDashoffset={500 - 500 * t} strokeLinecap="round" />
        <circle cx="40" cy="180" r="7" fill="#fff" stroke="var(--md-primary)" strokeWidth="3" />
        <text x="40" y="205" textAnchor="middle" fill="var(--md-on-surface)" fontSize="9">Centro</text>
        <circle cx="360" cy="150" r="7" fill="#fff" stroke="var(--md-on-primary-container)" strokeWidth="3" />
        <text x="360" y="175" textAnchor="middle" fill="var(--md-on-surface)" fontSize="9">Tu casa</text>
        {status !== "cancelado" && (
          <g transform={`translate(${pos.x}, ${pos.y})`}>
            <circle r="13" fill="var(--md-primary)" opacity="0.18">
              <animate attributeName="r" values="11;16;11" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <circle r="9" fill="var(--md-primary)" />
            <text textAnchor="middle" y="4" fontSize="10">🚚</text>
          </g>
        )}
      </svg>
      <div className="md-row" style={{ gap: 8, borderTop: "1px solid var(--md-outline-variant)", background: "var(--md-surface)", padding: "8px 16px", fontSize: "0.875rem" }}>
        <span style={{ height: 10, width: 10, borderRadius: "50%", background: "var(--md-secondary)" }} />
        <span className="md-muted">{locationLabel(status)}</span>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const searchByCode = (raw) => {
    const q = (raw || "").trim().toLowerCase();
    const found = orders.find((o) => o.id.toLowerCase() === q || o.tracking.toLowerCase() === q);
    if (found) {
      setResult(found);
      setError("");
    } else {
      setResult(null);
      setError("No encontramos un pedido con ese código. Prueba con ORD-2026-0001 o TRK-889201.");
    }
  };

  const search = (e) => {
    e.preventDefault();
    searchByCode(code);
  };

  const reportProblem = () => {
    if (!result) return;
    const resumen = result.items.map((it) => `${it.qty}x ${it.name}`).join(", ");
    const context =
      `Veo que tienes una consulta sobre tu pedido ${result.id} (tracking ${result.tracking}), con estado "${result.status}". Cuéntame qué problema tienes y te ayudo. 📦`;
    const message =
      `Tengo problemas con mi pedido ${result.id} (tracking ${result.tracking}). Estado: ${result.status}. Productos: ${resumen}. Dirección de envío: ${result.shippingAddress}. ¿Me puedes ayudar?`;
    window.dispatchEvent(new CustomEvent("open-assistant", { detail: { context, message } }));
  };

  const currentStep = result ? steps.indexOf(result.status) : -1;

  return (
    <div style={{ margin: "0 auto", maxWidth: 720 }}>
      <h1 className="md-headline-small" style={{ marginBottom: 8 }}>Seguimiento de pedidos</h1>
      <p className="md-muted" style={{ marginBottom: 16 }}>Ingresa tu número de pedido o código de tracking.</p>

      <form onSubmit={search} className="md-row" style={{ gap: 8 }}>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ORD-2026-0001 / TRK-889201" className="md-input" />
        <button type="submit" className="md-btn md-btn-filled md-state">Buscar</button>
      </form>

      <div className="md-card md-card-filled md-card-pad-sm" style={{ marginTop: 16 }}>
        <p className="md-form-label">Códigos de prueba</p>
        <div className="md-row md-wrap" style={{ gap: 8 }}>
          {demoCodes.map((d) => (
            <button key={d.code} type="button" onClick={() => { setCode(d.code); searchByCode(d.code); }} className="md-chip md-state">
              <span style={{ fontFamily: "monospace" }}>{d.code}</span>
              <span className="md-badge md-badge-primary-container" style={{ textTransform: "capitalize" }}>{d.status}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p style={{ marginTop: 16, fontSize: "0.875rem", color: "var(--md-error)" }}>{error}</p>}

      {result && (
        <div className="md-card md-card-elevated md-card-pad" style={{ marginTop: 24 }}>
          <div className="md-row-between">
            <div>
              <p className="md-title-small" style={{ margin: 0 }}>{result.id}</p>
              <p className="md-muted md-body-medium" style={{ margin: 0 }}>Tracking: {result.tracking}</p>
            </div>
            <span className="md-badge md-badge-primary" style={{ textTransform: "capitalize" }}>{result.status}</span>
          </div>

          <div className="md-row" style={{ marginTop: 24 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="md-row" style={{ width: "100%", gap: 0 }}>
                  {i > 0 && <div style={{ height: 4, flex: 1, background: i <= currentStep ? "var(--md-secondary)" : "var(--md-outline-variant)" }} />}
                  <div style={{ display: "flex", height: 32, width: 32, alignItems: "center", justifyContent: "center", borderRadius: "50%", fontSize: "0.75rem", color: "#fff", background: i <= currentStep ? "var(--md-secondary)" : "var(--md-outline)" }}>{i + 1}</div>
                  {i < steps.length - 1 && <div style={{ height: 4, flex: 1, background: i < currentStep ? "var(--md-secondary)" : "var(--md-outline-variant)" }} />}
                </div>
                <span style={{ marginTop: 8, textAlign: "center", fontSize: "0.75rem", textTransform: "capitalize" }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <p className="md-title-small" style={{ marginBottom: 8 }}>Ubicación en tiempo real</p>
            <OrderMap status={result.status} />
          </div>

          <div className="md-muted md-body-medium" style={{ marginTop: 24, borderTop: "1px solid var(--md-outline-variant)", paddingTop: 16 }}>
            <p><b>Dirección:</b> {result.shippingAddress}</p>
            <p><b>Fecha:</b> {result.date}</p>
          </div>

          <button onClick={reportProblem} className="md-btn md-btn-tonal md-btn-block md-state" style={{ marginTop: 20 }}>
            🤖 Tengo problemas con mi pedido
          </button>
        </div>
      )}
    </div>
  );
}
