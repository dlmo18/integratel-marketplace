"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getGiftcards } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

function genCode() {
  return "GIFT" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function GiftcardsPage() {
  const { addGiftcard } = useStore();
  const cards = getGiftcards();

  const [selected, setSelected] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [issued, setIssued] = useState([]);

  const buy = (e) => {
    e.preventDefault();
    if (!selected) return;
    const code = genCode();
    const voucher = {
      id: "vch-gift-" + Date.now(),
      code,
      discountType: selected.discountType,
      value: selected.value,
      minPurchase: 0,
      status: "activo",
      source: `Giftcard ${formatCurrency(selected.amount)}`,
      recipient: recipient || null
    };
    addGiftcard(voucher);
    setIssued((prev) => [{ ...voucher, amount: selected.amount }, ...prev]);
    setRecipient("");
    setSelected(null);
  };

  return (
    <div>
      <section className="page-header">
        <div className="md-container">
          <span className="md-badge md-badge-secondary">Nuevo</span>
          <h1 style={{ marginTop: 12 }}>Giftcards Movistar 🎁</h1>
          <p>
            Regala una tarjeta con saldo. Cada giftcard genera un código de
            voucher que se canjea en el carrito de compra.
          </p>
        </div>
      </section>

      <div className="md-container md-page" style={{ display: "grid", gap: 32, gridTemplateColumns: "1fr" }}>
        <div className="gc-layout">
          <div>
            <h2 className="md-title-large" style={{ marginBottom: 16 }}>Elige el monto</h2>
            <div className="prod-grid-3">
              {cards.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="md-card md-card-elevated md-state"
                  style={{ padding: 0, textAlign: "left", border: "none", cursor: "pointer", outline: selected?.id === c.id ? "2px solid var(--md-primary)" : "none" }}
                >
                  <div style={{ position: "relative", height: 112 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt="Giftcard" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,27,62,0.9), transparent)" }} />
                    <div style={{ position: "absolute", bottom: 8, left: 12, color: "#fff" }}>
                      <p style={{ margin: 0, fontSize: "0.72rem" }}>Giftcard Movistar</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>{formatCurrency(c.amount)}</p>
                    </div>
                  </div>
                  <div className="md-row-between" style={{ padding: 12, fontSize: "0.85rem" }}>
                    <span className="md-muted">Voucher canjeable</span>
                    <span className="md-primary-text" style={{ fontWeight: 600 }}>
                      {selected?.id === c.id ? "Seleccionada ✓" : "Elegir"}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {issued.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 className="md-title-medium" style={{ marginBottom: 12 }}>Tus giftcards compradas</h3>
                <div className="md-stack">
                  {issued.map((g) => (
                    <div key={g.code} className="md-card md-card-elevated md-card-pad-sm md-row-between">
                      <div>
                        <p className="md-muted md-body-medium" style={{ margin: 0 }}>
                          Giftcard {formatCurrency(g.amount)}{g.recipient ? ` · para ${g.recipient}` : ""}
                        </p>
                        <p style={{ margin: 0, fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700 }}>{g.code}</p>
                      </div>
                      <div className="md-row" style={{ gap: 12 }}>
                        <button onClick={() => navigator.clipboard?.writeText(g.code)} className="md-btn md-btn-text md-btn-sm md-state">Copiar</button>
                        <Link href="/checkout/carrito" className="md-btn md-btn-filled md-btn-sm md-state">Usar en el carrito</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="md-card md-card-elevated md-card-pad md-stack" style={{ height: "fit-content" }}>
            <h2 className="md-title-large" style={{ margin: 0 }}>Comprar giftcard</h2>
            {selected ? (
              <p className="md-muted md-body-medium" style={{ margin: 0 }}>
                Monto: <b style={{ color: "var(--md-on-surface)" }}>{formatCurrency(selected.amount)}</b>
              </p>
            ) : (
              <p className="md-muted md-body-medium" style={{ margin: 0 }}>Selecciona un monto a la izquierda.</p>
            )}
            <form onSubmit={buy} className="md-stack">
              <div>
                <label className="md-form-label">Correo del destinatario (opcional)</label>
                <input type="email" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="md-input" placeholder="regalo@correo.com" />
              </div>
              <button type="submit" disabled={!selected} className={`md-btn md-btn-block md-state ${selected ? "md-btn-green" : "md-btn-outlined"}`}>
                {selected ? `Comprar ${formatCurrency(selected.amount)}` : "Elige un monto"}
              </button>
            </form>
            <p className="md-muted" style={{ fontSize: "0.72rem", margin: 0 }}>
              Demo: la compra genera un código de voucher que se guarda en tu navegador y puedes aplicar en el carrito.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
