"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/lib/format";

// Mini-cart desplegable desde el ícono del carrito.
export default function CartPreview() {
  const { cart, cartCount, subtotal, discount, setQty, removeFromCart } =
    useStore();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const total = Math.max(0, subtotal - discount);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hdr-icon-btn md-state"
        aria-label="Carrito de compras"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="material-symbols-outlined">shopping_cart</span>
        {cartCount > 0 && <span className="md-count">{cartCount}</span>}
      </button>

      {open && (
        <div className="menu-pop">
          <div
            className="md-row-between"
            style={{ padding: "12px 16px", borderBottom: "1px solid var(--md-outline-variant)" }}
          >
            <p className="md-title-small" style={{ margin: 0 }}>
              Tu carrito{cartCount > 0 ? ` (${cartCount})` : ""}
            </p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--md-on-surface-variant)" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="md-center" style={{ padding: "32px 16px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: "var(--md-on-surface-variant)" }}>
                shopping_cart
              </span>
              <p className="md-muted" style={{ marginTop: 8 }}>Tu carrito está vacío.</p>
              <Link href="/catalogo" onClick={() => setOpen(false)} className="md-btn md-btn-filled md-state" style={{ marginTop: 12 }}>
                Ver catálogo
              </Link>
            </div>
          ) : (
            <>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: 288, overflowY: "auto" }}>
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="md-row"
                    style={{ padding: "12px 16px", gap: 12, borderBottom: "1px solid var(--md-outline-variant)", alignItems: "flex-start" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ height: 56, width: 56, borderRadius: 8, objectFit: "cover", background: "var(--md-surface-variant)", flexShrink: 0 }}
                    />
                    <div className="md-grow" style={{ minWidth: 0 }}>
                      <Link
                        href={`/producto/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="md-body-medium"
                        style={{ display: "block", fontWeight: 600 }}
                      >
                        {item.name}
                      </Link>
                      <div className="md-row-between" style={{ marginTop: 4 }}>
                        <div className="md-row" style={{ gap: 4 }}>
                          <button onClick={() => setQty(item.id, item.qty - 1)} className="qty-btn" aria-label="Disminuir">−</button>
                          <span style={{ width: 24, textAlign: "center", fontWeight: 600, fontSize: "0.8rem" }}>{item.qty}</span>
                          <button onClick={() => setQty(item.id, item.qty + 1)} className="qty-btn" aria-label="Aumentar">+</button>
                        </div>
                        <span className="md-primary-text" style={{ fontWeight: 700, fontSize: "0.8rem" }}>
                          {formatCurrency(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Quitar ${item.name}`}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--md-on-surface-variant)" }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div style={{ padding: "12px 16px", borderTop: "1px solid var(--md-outline-variant)" }}>
                <div className="md-row-between md-body-medium">
                  <span className="md-muted">Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="md-row-between md-body-medium" style={{ color: "var(--md-secondary)", marginTop: 4 }}>
                    <span>Descuento</span>
                    <span style={{ fontWeight: 600 }}>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="md-row-between" style={{ marginTop: 4, fontWeight: 700 }}>
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="md-col" style={{ marginTop: 12, gap: 8 }}>
                  <Link href="/checkout/carrito" onClick={() => setOpen(false)} className="md-btn md-btn-outlined md-btn-block md-state">
                    Ver carrito completo
                  </Link>
                  <Link href="/checkout/pago" onClick={() => setOpen(false)} className="md-btn md-btn-filled md-btn-block md-state">
                    Ir a pagar
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
