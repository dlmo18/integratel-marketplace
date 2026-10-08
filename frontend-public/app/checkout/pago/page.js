"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, breakdownIgv } from "@/lib/format";

const SOURCES = [
  { id: "cashback", label: "Cashback Movistar", desc: "Tu saldo disponible", icon: "🎁", color: "#019DF4" },
  { id: "wallet", label: "Yape / Plin", desc: "Paga al instante", icon: "📲", color: "#8B5CF6" },
  { id: "card", label: "Tarjeta Visa/Mastercard", desc: "Crédito o débito", icon: "💳", color: "#00337A" },
  { id: "bank", label: "Cuenta bancaria", desc: "Transferencia / depósito", icon: "🏦", color: "#5CB615" },
  { id: "credit", label: "Crédito Partner", desc: "Financiamiento aprobado", icon: "🤝", color: "#0EA5A5" }
];

const COURIERS = [
  { id: "serpost", label: "Serpost", desc: "Cobertura nacional", cost: 15, eta: "3 a 6 días hábiles", icon: "📮" },
  { id: "olva", label: "Olva Courier", desc: "Envío estándar", cost: 20, eta: "2 a 4 días hábiles", icon: "🚚" },
  { id: "dhl", label: "DHL Express", desc: "Envío exprés", cost: 45, eta: "1 a 2 días hábiles", icon: "✈️" },
  { id: "urbano", label: "Urbano", desc: "Entrega en Lima", cost: 12, eta: "1 a 3 días hábiles", icon: "🏍️" }
];

const round2 = (n) => Math.round(n * 100) / 100;

export default function PaymentPage() {
  const { cart, subtotal, discount, voucher, user, clearCart } = useStore();
  const [done, setDone] = useState(false);

  const savedAddresses = user?.addresses || [];
  const [courierId, setCourierId] = useState("serpost");
  const courier = COURIERS.find((c) => c.id === courierId) || COURIERS[0];
  const freeShipping = subtotal > 1000;
  const shipping = subtotal === 0 ? 0 : freeShipping ? 0 : courier.cost;

  const [addressMode, setAddressMode] = useState(savedAddresses.length ? "saved" : "new");
  const [selectedAddressId, setSelectedAddressId] = useState(
    savedAddresses.find((a) => a.default)?.id || savedAddresses[0]?.id || ""
  );
  const [newAddress, setNewAddress] = useState({ line1: "", district: "", city: "", reference: "" });

  const addressComplete =
    addressMode === "saved"
      ? !!selectedAddressId
      : newAddress.line1.trim() && newAddress.district.trim() && newAddress.city.trim();

  const total = round2(Math.max(0, subtotal - discount) + shipping);
  const taxedAmount = Math.max(0, subtotal - discount);
  const { base: taxBase, igv } = breakdownIgv(taxedAmount);

  const [selected, setSelected] = useState({ wallet: true });
  const [amounts, setAmounts] = useState({});
  const activeIds = Object.keys(selected).filter((k) => selected[k]);
  const assigned = round2(activeIds.reduce((acc, id) => acc + (Number(amounts[id]) || 0), 0));
  const remaining = round2(total - assigned);
  const balanced = Math.abs(remaining) < 0.01 && activeIds.length > 0;

  const toggle = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
    setAmounts((prev) => {
      if (!selected[id]) {
        const rem = round2(
          total -
            Object.keys(selected).filter((k) => selected[k] && k !== id).reduce((a, k) => a + (Number(prev[k]) || 0), 0)
        );
        return { ...prev, [id]: rem > 0 ? rem : 0 };
      }
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };
  const setAmount = (id, value) => setAmounts((prev) => ({ ...prev, [id]: value }));

  const splitEven = () => {
    if (activeIds.length === 0) return;
    const base = Math.floor((total / activeIds.length) * 100) / 100;
    const next = {};
    activeIds.forEach((id, i) => {
      next[id] = i === activeIds.length - 1 ? round2(total - base * (activeIds.length - 1)) : base;
    });
    setAmounts(next);
  };
  const fillRemaining = () => {
    if (activeIds.length === 0) return;
    const lastId = activeIds[activeIds.length - 1];
    const others = activeIds.filter((id) => id !== lastId).reduce((a, id) => a + (Number(amounts[id]) || 0), 0);
    setAmounts((prev) => ({ ...prev, [lastId]: round2(Math.max(0, total - others)) }));
  };

  const pay = (e) => {
    e.preventDefault();
    if (!balanced || !addressComplete) return;
    setDone(true);
    clearCart();
  };
  const canPay = balanced && addressComplete;

  if (done) {
    return (
      <div className="md-container md-page" style={{ paddingBlock: 64 }}>
        <div className="md-card md-card-elevated md-card-pad md-center" style={{ margin: "0 auto", maxWidth: 520 }}>
          <div style={{ margin: "0 auto 16px", display: "flex", height: 64, width: 64, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "var(--md-secondary)", color: "var(--md-on-secondary)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32 }}>check</span>
          </div>
          <h1 className="md-headline-small">¡Pago realizado con éxito!</h1>
          <p className="md-muted" style={{ marginTop: 8 }}>
            Tu pedido fue registrado (demo) con cobro compartido entre {activeIds.length} fuente(s) de pago.
          </p>
          <p style={{ marginTop: 8, fontWeight: 600 }}>N° de pedido: ORD-2026-{Math.floor(1000 + Math.random() * 9000)}</p>
          <div className="md-row md-center" style={{ justifyContent: "center", gap: 12, marginTop: 24 }}>
            <Link href="/cuenta/compras" className="md-btn md-btn-filled md-state">Ver mis compras</Link>
            <Link href="/catalogo" className="md-btn md-btn-outlined md-state">Seguir comprando</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="md-container md-page md-center" style={{ paddingBlock: 64 }}>
        <p className="md-muted">No tienes productos en el carrito.</p>
        <Link href="/catalogo" className="md-btn md-btn-filled md-state" style={{ marginTop: 16 }}>Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="md-container md-page">
      <h1 className="md-headline-large" style={{ marginBottom: 24 }}>Proceso de pago</h1>
      <form onSubmit={pay} className="checkout-layout">
        <div className="md-stack">
          {/* Envío */}
          <div className="md-card md-card-elevated md-card-pad">
            <h2 className="md-title-large" style={{ marginTop: 0 }}>Envío</h2>
            <p className="md-title-small" style={{ marginBottom: 8 }}>Transportista</p>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {COURIERS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCourierId(c.id)}
                  className="md-state"
                  style={{ display: "flex", gap: 12, alignItems: "flex-start", textAlign: "left", borderRadius: "var(--md-shape-md)", padding: 12, cursor: "pointer", border: `2px solid ${courierId === c.id ? "var(--md-primary)" : "var(--md-outline-variant)"}`, background: courierId === c.id ? "color-mix(in srgb, var(--md-primary) 6%, transparent)" : "transparent" }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{c.icon}</span>
                  <div className="md-grow">
                    <p className="md-title-small" style={{ margin: 0 }}>{c.label}</p>
                    <p className="md-muted" style={{ margin: 0, fontSize: "0.75rem" }}>{c.desc} · {c.eta}</p>
                  </div>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(c.cost)}</span>
                </button>
              ))}
            </div>

            {/* Dirección */}
            <div style={{ marginTop: 24 }}>
              <div className="md-row-between" style={{ marginBottom: 8 }}>
                <p className="md-title-small" style={{ margin: 0 }}>Dirección de envío</p>
                {savedAddresses.length > 0 && (
                  <div style={{ display: "flex", gap: 4, borderRadius: "var(--md-shape-full)", background: "var(--md-surface-container-high)", padding: 4, fontSize: "0.75rem" }}>
                    <button type="button" onClick={() => setAddressMode("saved")} style={{ borderRadius: "var(--md-shape-full)", padding: "4px 12px", border: "none", cursor: "pointer", fontWeight: 600, background: addressMode === "saved" ? "var(--md-primary)" : "transparent", color: addressMode === "saved" ? "var(--md-on-primary)" : "var(--md-on-surface)" }}>Mis direcciones</button>
                    <button type="button" onClick={() => setAddressMode("new")} style={{ borderRadius: "var(--md-shape-full)", padding: "4px 12px", border: "none", cursor: "pointer", fontWeight: 600, background: addressMode === "new" ? "var(--md-primary)" : "transparent", color: addressMode === "new" ? "var(--md-on-primary)" : "var(--md-on-surface)" }}>Nueva dirección</button>
                  </div>
                )}
              </div>

              {addressMode === "saved" && savedAddresses.length > 0 ? (
                <div className="md-stack" style={{ gap: 8 }}>
                  {savedAddresses.map((a) => (
                    <label key={a.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", borderRadius: "var(--md-shape-md)", padding: 12, cursor: "pointer", border: `2px solid ${selectedAddressId === a.id ? "var(--md-primary)" : "var(--md-outline-variant)"}` }}>
                      <input type="radio" name="address" checked={selectedAddressId === a.id} onChange={() => setSelectedAddressId(a.id)} style={{ marginTop: 2, accentColor: "var(--md-primary)" }} />
                      <div style={{ fontSize: "0.875rem" }}>
                        <p className="md-title-small" style={{ margin: 0 }}>
                          {a.alias} {a.default && <span className="md-badge md-badge-primary">Principal</span>}
                        </p>
                        <p className="md-muted" style={{ margin: 0 }}>{a.line1}, {a.district}, {a.city}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="md-form-label">Dirección</label>
                    <input value={newAddress.line1} onChange={(e) => setNewAddress((p) => ({ ...p, line1: e.target.value }))} className="md-input" placeholder="Av. / Calle y número" required={addressMode === "new"} />
                  </div>
                  <div>
                    <label className="md-form-label">Distrito</label>
                    <input value={newAddress.district} onChange={(e) => setNewAddress((p) => ({ ...p, district: e.target.value }))} className="md-input" placeholder="Distrito" required={addressMode === "new"} />
                  </div>
                  <div>
                    <label className="md-form-label">Ciudad</label>
                    <input value={newAddress.city} onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))} className="md-input" placeholder="Ciudad" required={addressMode === "new"} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="md-form-label">Referencia (opcional)</label>
                    <input value={newAddress.reference} onChange={(e) => setNewAddress((p) => ({ ...p, reference: e.target.value }))} className="md-input" placeholder="Ej. frente al parque" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pagos asociados */}
          <div className="md-card md-card-elevated md-card-pad">
            <div className="md-row-between">
              <h2 className="md-title-large" style={{ margin: 0 }}>Pagos asociados</h2>
              <span className="md-muted" style={{ fontSize: "0.75rem" }}>Cobro compartido entre varias fuentes</span>
            </div>
            <p className="md-muted md-body-medium" style={{ marginTop: 4, marginBottom: 16 }}>
              Selecciona 2 o más fuentes y reparte el monto. La suma debe igualar el total.
            </p>

            <div className="md-stack" style={{ gap: 12 }}>
              {SOURCES.map((s) => {
                const active = !!selected[s.id];
                return (
                  <div key={s.id} style={{ borderRadius: "var(--md-shape-md)", padding: 12, border: `2px solid ${active ? "var(--md-primary)" : "var(--md-outline-variant)"}`, background: active ? "color-mix(in srgb, var(--md-primary) 6%, transparent)" : "transparent" }}>
                    <div className="md-row" style={{ gap: 12 }}>
                      <input type="checkbox" checked={active} onChange={() => toggle(s.id)} style={{ height: 18, width: 18, accentColor: "var(--md-primary)" }} />
                      <span style={{ display: "inline-flex", height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: "var(--md-shape-sm)", fontSize: "1.2rem", background: `${s.color}22` }}>{s.icon}</span>
                      <div className="md-grow">
                        <p className="md-title-small" style={{ margin: 0 }}>{s.label}</p>
                        <p className="md-muted" style={{ margin: 0, fontSize: "0.75rem" }}>{s.desc}</p>
                      </div>
                      <span className={`md-badge ${active ? "md-badge-secondary" : "md-badge-container"}`}>{active ? "Aplicado" : "Disponible"}</span>
                    </div>
                    {active && (
                      <div className="md-row" style={{ gap: 8, marginTop: 12, paddingLeft: 64 }}>
                        <span className="md-muted" style={{ fontSize: "0.875rem" }}>S/</span>
                        <input type="number" min="0" step="0.01" value={amounts[s.id] ?? ""} onChange={(e) => setAmount(s.id, e.target.value)} className="md-input" style={{ width: 160 }} placeholder="0.00" />
                        <span className="md-muted" style={{ fontSize: "0.75rem" }}>asignado a esta fuente</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="md-row md-wrap" style={{ gap: 8, marginTop: 16 }}>
              <button type="button" onClick={splitEven} className="md-btn md-btn-outlined md-btn-sm md-state">Dividir en partes iguales</button>
              <button type="button" onClick={fillRemaining} className="md-btn md-btn-outlined md-btn-sm md-state">Completar restante</button>
            </div>

            {activeIds.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <p className="md-title-small">Distribución del pago</p>
                <div style={{ display: "flex", height: 16, overflow: "hidden", borderRadius: "var(--md-shape-full)", background: "var(--md-surface-container-high)" }}>
                  {activeIds.map((id) => {
                    const src = SOURCES.find((s) => s.id === id);
                    const amt = Number(amounts[id]) || 0;
                    const pct = total > 0 ? (amt / total) * 100 : 0;
                    return <div key={id} style={{ width: `${pct}%`, background: src?.color }} title={`${src?.label}: ${formatCurrency(amt)}`} />;
                  })}
                </div>
                <div className="md-row md-wrap" style={{ gap: "4px 16px", marginTop: 8, fontSize: "0.75rem" }}>
                  {activeIds.map((id) => {
                    const src = SOURCES.find((s) => s.id === id);
                    return (
                      <span key={id} className="md-row" style={{ gap: 4 }}>
                        <span style={{ display: "inline-block", height: 8, width: 8, borderRadius: "50%", background: src?.color }} />
                        {src?.label}: {formatCurrency(Number(amounts[id]) || 0)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={`md-alert ${balanced ? "md-alert-success" : "md-alert-warning"}`} style={{ marginTop: 16 }}>
              {balanced
                ? <>✓ La distribución cuadra con el total ({formatCurrency(total)}).</>
                : <>Asignado {formatCurrency(assigned)} de {formatCurrency(total)}. {remaining > 0 ? `Falta asignar ${formatCurrency(remaining)}.` : `Te excedes por ${formatCurrency(Math.abs(remaining))}.`}</>}
            </div>
          </div>
        </div>

        {/* Resumen */}
        <aside className="md-card md-card-elevated md-card-pad md-stack" style={{ height: "fit-content" }}>
          <h2 className="md-title-large" style={{ margin: 0 }}>Tu pedido</h2>
          <div style={{ maxHeight: 192, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, fontSize: "0.875rem" }}>
            {cart.map((i) => (
              <div key={i.id} className="md-row-between">
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.qty}× {i.name}</span>
                <span>{formatCurrency(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="md-divider" />
          <div className="md-row-between md-body-medium"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          {discount > 0 && (
            <div className="md-row-between md-body-medium" style={{ color: "var(--md-secondary)" }}>
              <span>Descuento {voucher ? `(${voucher.code})` : ""}</span><span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="md-row-between md-body-medium md-muted"><span>Base imponible</span><span>{formatCurrency(taxBase)}</span></div>
          <div className="md-row-between md-body-medium md-muted"><span>IGV (18%)</span><span>{formatCurrency(igv)}</span></div>
          <div className="md-row-between md-body-medium"><span>Envío ({courier.label})</span><span>{shipping === 0 ? "Gratis" : formatCurrency(shipping)}</span></div>
          <div className="md-alert md-alert-success" style={{ fontSize: "0.78rem" }}>
            {freeShipping ? "🎉 ¡Tu compra tiene envío gratis!" : <>🚚 Te faltan <b>{formatCurrency(Math.max(0, 1000 - subtotal))}</b> para envío gratis.</>}
          </div>
          <div className="md-divider" />
          <div className="md-row-between" style={{ fontWeight: 700, fontSize: "1.1rem" }}><span>Total a pagar</span><span>{formatCurrency(total)}</span></div>
          <p className="md-muted" style={{ fontSize: "0.7rem", margin: 0 }}>IGV incluido en el precio de los productos.</p>
          {!addressComplete && <p style={{ fontSize: "0.75rem", color: "var(--md-warning)" }}>Completa la dirección de envío para continuar.</p>}
          <button type="submit" disabled={!canPay} className={`md-btn md-btn-block md-state ${canPay ? "md-btn-green" : "md-btn-outlined"}`}>
            {!balanced ? "Reparte el total para pagar" : !addressComplete ? "Falta la dirección de envío" : `Pagar ${formatCurrency(total)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}
