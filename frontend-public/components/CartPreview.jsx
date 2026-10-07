"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/lib/format";

// Previsualización del carrito (mini-cart) que se despliega en la misma
// pantalla al pulsar el ícono del carrito, antes de redirigir al carrito
// completo o al pago.
export default function CartPreview() {
  const { cart, cartCount, subtotal, discount, setQty, removeFromCart } =
    useStore();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const pathname = usePathname();

  // Cierra al navegar a otra ruta.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Cierra al hacer clic fuera o con la tecla Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const total = Math.max(0, subtotal - discount);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full bg-white p-2 hover:bg-white/70"
        aria-label="Carrito de compras"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="text-xl">🛒</span>
        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-movistar-green text-[10px] font-bold text-white">
            {cartCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl bg-white text-movistar-navy shadow-2xl ring-1 ring-black/5">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-bold">
              Tu carrito{cartCount > 0 ? ` (${cartCount})` : ""}
            </p>
            <button
              onClick={() => setOpen(false)}
              className="text-movistar-gray-med hover:text-movistar-navy"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-3xl">🛒</p>
              <p className="mt-2 text-sm text-movistar-gray-med">
                Tu carrito está vacío.
              </p>
              <Link
                href="/catalogo"
                onClick={() => setOpen(false)}
                className="btn-primary mt-4 inline-flex"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <>
              <ul className="max-h-72 divide-y overflow-y-auto">
                {cart.map((item) => (
                  <li key={item.id} className="flex gap-3 px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        item.image ||
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><rect width='56' height='56' fill='%23e5e7eb'/></svg>"
                      }
                      alt={item.name}
                      className="h-14 w-14 flex-shrink-0 rounded-lg bg-movistar-gray object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/producto/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-xs font-semibold hover:text-movistar-blue"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border text-sm leading-none hover:bg-movistar-gray"
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border text-sm leading-none hover:bg-movistar-gray"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-bold text-movistar-blue">
                          {formatCurrency(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="self-start text-movistar-gray-med hover:text-red-500"
                      aria-label={`Quitar ${item.name}`}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>

              <div className="border-t px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-movistar-gray-med">Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="mt-1 flex items-center justify-between text-sm text-movistar-green">
                    <span>Descuento</span>
                    <span className="font-semibold">
                      -{formatCurrency(discount)}
                    </span>
                  </div>
                )}
                <div className="mt-1 flex items-center justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <Link
                    href="/checkout/carrito"
                    onClick={() => setOpen(false)}
                    className="btn-outline w-full justify-center text-center"
                  >
                    Ver carrito completo
                  </Link>
                  <Link
                    href="/checkout/pago"
                    onClick={() => setOpen(false)}
                    className="btn-primary w-full justify-center text-center"
                  >
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
