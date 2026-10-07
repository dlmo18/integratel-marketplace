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

  // Desglose de IGV (18%): los precios ya incluyen IGV, así que separamos la
  // base imponible y el impuesto a partir de los productos (sin el envío).
  const taxedAmount = Math.max(0, subtotal - discount);
  const { base: taxBase, igv } = breakdownIgv(taxedAmount);
  const missingForFree = Math.max(0, FREE_SHIPPING_MIN - subtotal);

  const apply = (e) => {
    e.preventDefault();
    setError("");
    // Incluye las giftcards compradas (guardadas en el navegador) al validar.
    const res = findVoucherByCode(code, giftcards);
    if (res.error) {
      setError(res.error);
      return;
    }
    const v = res.voucher;
    if (subtotal < (v.minPurchase || 0)) {
      setError(
        `Este voucher requiere una compra mínima de ${formatCurrency(v.minPurchase)}.`
      );
      return;
    }
    applyVoucher(v);
    setCode("");
  };

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-bold text-movistar-navy">
        Carrito de compra
      </h1>

      {cart.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-lg text-movistar-gray-med">Tu carrito está vacío</p>
          <Link href="/catalogo" className="btn-primary mt-4">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="card flex items-center gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <Link
                    href={`/producto/${item.slug}`}
                    className="font-semibold hover:text-movistar-blue"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-movistar-gray-med">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="flex items-center rounded-full border">
                  <button
                    onClick={() => setQty(item.id, item.qty - 1)}
                    className="px-3 py-1"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.id, item.qty + 1)}
                    className="px-3 py-1"
                  >
                    +
                  </button>
                </div>
                <span className="w-24 text-right font-bold text-movistar-navy">
                  {formatCurrency(item.price * item.qty)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-movistar-gray-med hover:text-red-500"
                  aria-label="Eliminar"
                >
                  🗑️
                </button>
              </div>
            ))}
            <button onClick={clearCart} className="text-sm text-movistar-gray-med hover:underline">
              Vaciar carrito
            </button>
          </div>

          <aside className="card h-fit space-y-4 p-6">
            <h2 className="text-lg font-bold text-movistar-navy">Resumen</h2>

            {/* Voucher / cupón de descuento */}
            <div className="rounded-xl bg-movistar-gray p-3">
              <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-movistar-navy">
                🎟️ Cupón o voucher
              </p>
              {voucher ? (
                <div className="flex items-center justify-between rounded-lg bg-white p-2 text-sm">
                  <div>
                    <p className="font-mono font-bold text-movistar-navy">
                      {voucher.code}
                    </p>
                    <p className="text-xs text-movistar-green">
                      {voucher.discountType === "percent"
                        ? `${voucher.value}% aplicado`
                        : `${formatCurrency(voucher.value)} aplicado`}
                    </p>
                  </div>
                  <button
                    onClick={removeVoucher}
                    className="text-xs font-semibold text-red-500 hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={apply} className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Ingresa tu código"
                    className="input text-sm"
                  />
                  <button type="submit" className="btn-primary px-4">
                    Aplicar
                  </button>
                </form>
              )}
              {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
              {!voucher && (
                <p className="mt-2 text-[11px] text-movistar-gray-med">
                  Usa un voucher (ver Mi Cuenta), un código de <b>Giftcard</b> o prueba <b>DESC20SOLES</b>.
                </p>
              )}
            </div>

            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-movistar-green">
                <span>Descuento voucher</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            {/* Desglose de IGV (precios con IGV incluido) */}
            <div className="space-y-1 border-t pt-3 text-sm text-movistar-gray-med">
              <div className="flex justify-between">
                <span>Base imponible</span>
                <span>{formatCurrency(taxBase)}</span>
              </div>
              <div className="flex justify-between">
                <span>IGV (18%)</span>
                <span>{formatCurrency(igv)}</span>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span>Envío</span>
              <span>{shipping === 0 ? "Gratis" : formatCurrency(shipping)}</span>
            </div>

            {/* Aviso de envío gratis */}
            <div className="rounded-lg bg-movistar-green/10 px-3 py-2 text-xs text-movistar-green">
              {subtotal === 0 ? (
                "🚚 Envío gratis en compras mayores a S/ 1,000."
              ) : missingForFree > 0 ? (
                <>
                  🚚 Te faltan <b>{formatCurrency(missingForFree)}</b> para
                  envío gratis.
                </>
              ) : (
                "🎉 ¡Tu compra tiene envío gratis!"
              )}
            </div>

            <div className="flex justify-between border-t pt-3 text-lg font-bold text-movistar-navy">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <p className="text-[11px] text-movistar-gray-med">
              IGV incluido en el precio de los productos.
            </p>
            <Link href="/checkout/pago" className="btn-primary w-full">
              Continuar al pago
            </Link>
            <Link href="/catalogo" className="btn-outline w-full">
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
