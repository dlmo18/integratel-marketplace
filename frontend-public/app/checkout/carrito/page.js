"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { findVoucherByCode } from "@/lib/data";
import { formatCurrency, breakdownIgv } from "@/lib/format";

const FREE_SHIPPING_MIN = 1000;

export default function CartPage() {
  const {
    cart,
    setQty,
    removeFromCart,
    subtotal,
    clearCart,
    voucher,
    discount,
    applyVoucher,
    removeVoucher,
    giftcards
  } = useStore();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const shipping = subtotal > 0 ? (subtotal > FREE_SHIPPING_MIN ? 0 : 20) : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  const taxedAmount = Math.max(0, subtotal - discount);
  const { base: taxBase, igv } = breakdownIgv(taxedAmount);
  const missingForFree = Math.max(0, FREE_SHIPPING_MIN - subtotal);

  const apply = (e) => {
    e.preventDefault();
    setError("");
    const res = findVoucherByCode(code, giftcards);
    if (res.error) return setError(res.error);
    const v = res.voucher;
    if (subtotal < (v.minPurchase || 0)) {
      return setError(`Este voucher requiere una compra mínima de ${formatCurrency(v.minPurchase)}.`);
    }
    applyVoucher(v);
    setCode("");
  };

  return (
    <div className="md-container md-page">
      <h1 className="md-headline-large" style={{ marginBottom: 24 }}>Carrito de compra</h1>

      {cart.length === 0 ? (
        <div className="md-card md-card-elevated md-card-pad md-center">
          <p className="md-muted" style={{ fontSize: "1.1rem" }}>Tu carrito está vacío</p>
          <Link href="/catalogo" className="md-btn md-btn-filled md-state" style={{ marginTop: 16 }}>Explorar productos</Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <div className="md-stack">
            {cart.map((item) => (
              <div key={item.id} className="md-card md-card-elevated md-card-pad-sm md-row" style={{ gap: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} style={{ height: 80, width: 80, borderRadius: "var(--md-shape-md)", objectFit: "cover" }} />
                <div className="md-grow">
                  <Link href={`/producto/${item.slug}`} className="md-title-small">{item.name}</Link>
                  <p className="md-muted md-body-medium" style={{ margin: "4px 0 0" }}>{formatCurrency(item.price)}</p>
                </div>
                <div className="qty-group">
                  <button onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => setQty(item.id, item.qty + 1)}>+</button>
                </div>
                <span style={{ width: 96, textAlign: "right", fontWeight: 700 }}>{formatCurrency(item.price * item.qty)}</span>
                <button onClick={() => removeFromCart(item.id)} aria-label="Eliminar" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--md-on-surface-variant)" }}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
            <button onClick={clearCart} className="md-btn md-btn-text md-btn-sm md-state" style={{ alignSelf: "flex-start" }}>Vaciar carrito</button>
          </div>

          <aside className="md-card md-card-elevated md-card-pad md-stack" style={{ height: "fit-content" }}>
            <h2 className="md-title-large" style={{ margin: 0 }}>Resumen</h2>

            {/* Voucher */}
            <div style={{ borderRadius: "var(--md-shape-md)", background: "var(--md-surface-container-high)", padding: 12 }}>
              <p className="md-title-small" style={{ margin: "0 0 8px", display: "flex", alignItems: "center", gap: 6 }}>
                🎟️ Cupón o voucher
              </p>
              {voucher ? (
                <div className="md-row-between" style={{ background: "var(--md-surface)", borderRadius: "var(--md-shape-sm)", padding: 8 }}>
                  <div>
                    <p style={{ margin: 0, fontFamily: "monospace", fontWeight: 700 }}>{voucher.code}</p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--md-secondary)" }}>
                      {voucher.discountType === "percent" ? `${voucher.value}% aplicado` : `${formatCurrency(voucher.value)} aplicado`}
                    </p>
                  </div>
                  <button onClick={removeVoucher} className="md-btn md-btn-text md-btn-sm" style={{ color: "var(--md-error)" }}>Quitar</button>
                </div>
              ) : (
                <form onSubmit={apply} className="md-row" style={{ gap: 8 }}>
                  <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Ingresa tu código" className="md-input" />
                  <button type="submit" className="md-btn md-btn-filled md-state">Aplicar</button>
                </form>
              )}
              {error && <p style={{ marginTop: 8, fontSize: "0.75rem", color: "var(--md-error)" }}>{error}</p>}
              {!voucher && (
                <p className="md-muted" style={{ marginTop: 8, fontSize: "0.7rem" }}>
                  Usa un voucher (ver Mi Cuenta), un código de <b>Giftcard</b> o prueba <b>DESC20SOLES</b>.
                </p>
              )}
            </div>

            <div className="md-row-between md-body-medium">
              <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="md-row-between md-body-medium" style={{ color: "var(--md-secondary)" }}>
                <span>Descuento voucher</span><span>-{formatCurrency(discount)}</span>
              </div>
            )}

            {/* IGV */}
            <div className="md-divider" />
            <div className="md-row-between md-body-medium md-muted">
              <span>Base imponible</span><span>{formatCurrency(taxBase)}</span>
            </div>
            <div className="md-row-between md-body-medium md-muted">
              <span>IGV (18%)</span><span>{formatCurrency(igv)}</span>
            </div>

            <div className="md-row-between md-body-medium">
              <span>Envío</span><span>{shipping === 0 ? "Gratis" : formatCurrency(shipping)}</span>
            </div>

            <div className="md-alert md-alert-success" style={{ fontSize: "0.78rem" }}>
              {subtotal === 0
                ? "🚚 Envío gratis en compras mayores a S/ 1,000."
                : missingForFree > 0
                ? <>🚚 Te faltan <b>{formatCurrency(missingForFree)}</b> para envío gratis.</>
                : "🎉 ¡Tu compra tiene envío gratis!"}
            </div>

            <div className="md-divider" />
            <div className="md-row-between" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
              <span>Total</span><span>{formatCurrency(total)}</span>
            </div>
            <p className="md-muted" style={{ fontSize: "0.7rem", margin: 0 }}>IGV incluido en el precio de los productos.</p>

            <Link href="/checkout/pago" className="md-btn md-btn-filled md-btn-block md-state">Continuar al pago</Link>
            <Link href="/catalogo" className="md-btn md-btn-outlined md-btn-block md-state">Seguir comprando</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
