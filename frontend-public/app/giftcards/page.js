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
      {/* Encabezado */}
      <section className="bg-gradient-to-br from-movistar-navy to-movistar-blue py-12 text-white">
        <div className="container-page">
          <span className="badge bg-movistar-green text-white">Nuevo</span>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Giftcards Integratel 🎁</h1>
          <p className="mt-2 max-w-xl text-white/80">
            Regala una tarjeta con saldo. Cada giftcard genera un código de
            voucher que se canjea en el carrito de compra.
          </p>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        {/* Catálogo */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-movistar-navy">Elige el monto</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            {cards.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`card relative overflow-hidden p-0 text-left transition-transform hover:-translate-y-1 ${
                  selected?.id === c.id ? "ring-2 ring-movistar-blue" : ""
                }`}
              >
                <div className="relative h-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt="Giftcard" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-movistar-navy/90 to-transparent" />
                  <div className="absolute bottom-2 left-3 text-white">
                    <p className="text-xs">Giftcard Integratel</p>
                    <p className="text-2xl font-black">{formatCurrency(c.amount)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 text-sm">
                  <span className="text-movistar-gray-med">Voucher canjeable</span>
                  <span className="font-semibold text-movistar-blue">
                    {selected?.id === c.id ? "Seleccionada ✓" : "Elegir"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Giftcards emitidas en la sesión */}
          {issued.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 font-bold text-movistar-navy">Tus giftcards compradas</h3>
              <div className="space-y-3">
                {issued.map((g) => (
                  <div key={g.code} className="card flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm text-movistar-gray-med">
                        Giftcard {formatCurrency(g.amount)}
                        {g.recipient ? ` · para ${g.recipient}` : ""}
                      </p>
                      <p className="font-mono text-lg font-bold text-movistar-navy">{g.code}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigator.clipboard?.writeText(g.code)}
                        className="text-xs font-semibold text-movistar-blue hover:underline"
                      >
                        Copiar
                      </button>
                      <Link href="/checkout/carrito" className="btn-primary px-4 py-1.5 text-xs">
                        Usar en el carrito
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Compra */}
        <aside className="card h-fit space-y-4 p-6">
          <h2 className="text-lg font-bold text-movistar-navy">Comprar giftcard</h2>
          {selected ? (
            <p className="text-sm text-movistar-gray-med">
              Monto: <b className="text-movistar-navy">{formatCurrency(selected.amount)}</b>
            </p>
          ) : (
            <p className="text-sm text-movistar-gray-med">Selecciona un monto a la izquierda.</p>
          )}
          <form onSubmit={buy} className="space-y-4">
            <label className="block text-sm">
              Correo del destinatario (opcional)
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="input mt-1"
                placeholder="regalo@correo.com"
              />
            </label>
            <button type="submit" disabled={!selected} className={`w-full ${selected ? "btn-green" : "btn-outline cursor-not-allowed opacity-50"}`}>
              {selected ? `Comprar ${formatCurrency(selected.amount)}` : "Elige un monto"}
            </button>
          </form>
          <p className="text-[11px] text-movistar-gray-med">
            Demo: la compra genera un código de voucher que se guarda en tu
            navegador y puedes aplicar en el carrito.
          </p>
        </aside>
      </div>
    </div>
  );
}
