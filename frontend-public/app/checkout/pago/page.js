"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/lib/format";

// Fuentes de pago disponibles para el cobro compartido ("Pagos asociados").
const SOURCES = [
  { id: "cashback", label: "Cashback Integratel", desc: "Tu saldo disponible", icon: "🎁", color: "#019DF4" },
  { id: "wallet", label: "Yape / Plin", desc: "Paga al instante", icon: "📲", color: "#8B5CF6" },
  { id: "card", label: "Tarjeta Visa/Mastercard", desc: "Crédito o débito", icon: "💳", color: "#00337A" },
  { id: "bank", label: "Cuenta bancaria", desc: "Transferencia / depósito", icon: "🏦", color: "#5CB615" },
  { id: "credit", label: "Crédito Partner", desc: "Financiamiento aprobado", icon: "🤝", color: "#0EA5A5" }
];

// Transportistas disponibles (courier): costo y tiempo estimado.
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

  // --- Envío: transportista + dirección ---
  const savedAddresses = user?.addresses || [];
  const [courierId, setCourierId] = useState("serpost");
  const courier = COURIERS.find((c) => c.id === courierId) || COURIERS[0];
  // Envío gratis en compras > S/1000; si no, cuesta según el courier.
  const freeShipping = subtotal > 1000;
  const shipping = subtotal === 0 ? 0 : freeShipping ? 0 : courier.cost;

  const [addressMode, setAddressMode] = useState(
    savedAddresses.length ? "saved" : "new"
  );
  const [selectedAddressId, setSelectedAddressId] = useState(
    savedAddresses.find((a) => a.default)?.id || savedAddresses[0]?.id || ""
  );
  const [newAddress, setNewAddress] = useState({
    line1: "",
    district: "",
    city: "",
    reference: ""
  });

  const addressComplete =
    addressMode === "saved"
      ? !!selectedAddressId
      : newAddress.line1.trim() && newAddress.district.trim() && newAddress.city.trim();

  const total = round2(Math.max(0, subtotal - discount) + shipping);

  // Estado de pagos asociados: qué fuentes están activas y con cuánto monto.
  const [selected, setSelected] = useState({ wallet: true });
  const [amounts, setAmounts] = useState({});

  const activeIds = Object.keys(selected).filter((k) => selected[k]);

  const assigned = round2(
    activeIds.reduce((acc, id) => acc + (Number(amounts[id]) || 0), 0)
  );
  const remaining = round2(total - assigned);
  const balanced = Math.abs(remaining) < 0.01 && activeIds.length > 0;

  const toggle = (id) => {
    setSelected((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
    // Al activar una fuente, si no tiene monto, le asignamos el restante.
    setAmounts((prev) => {
      if (!selected[id]) {
        const rem = round2(
          total -
            Object.keys(selected)
              .filter((k) => selected[k] && k !== id)
              .reduce((a, k) => a + (Number(prev[k]) || 0), 0)
        );
        return { ...prev, [id]: rem > 0 ? rem : 0 };
      }
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const setAmount = (id, value) => {
    setAmounts((prev) => ({ ...prev, [id]: value }));
  };

  // Distribuye el total equitativamente entre las fuentes activas.
  const splitEven = () => {
    if (activeIds.length === 0) return;
    const base = Math.floor((total / activeIds.length) * 100) / 100;
    const next = {};
    activeIds.forEach((id, i) => {
      next[id] =
        i === activeIds.length - 1
          ? round2(total - base * (activeIds.length - 1))
          : base;
    });
    setAmounts(next);
  };

  // Autocompleta la última fuente con el monto restante.
  const fillRemaining = () => {
    if (activeIds.length === 0) return;
    const lastId = activeIds[activeIds.length - 1];
    const others = activeIds
      .filter((id) => id !== lastId)
      .reduce((a, id) => a + (Number(amounts[id]) || 0), 0);
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
      <div className="container-page py-16">
        <div className="card mx-auto max-w-lg p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-movistar-green text-3xl text-white">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-movistar-navy">
            ¡Pago realizado con éxito!
          </h1>
          <p className="mt-2 text-movistar-gray-med">
            Tu pedido fue registrado (demo) con cobro compartido entre{" "}
            {activeIds.length} fuente(s) de pago.
          </p>
          <p className="mt-2 font-semibold">
            N° de pedido: ORD-2026-{Math.floor(1000 + Math.random() * 9000)}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/cuenta/compras" className="btn-primary">
              Ver mis compras
            </Link>
            <Link href="/catalogo" className="btn-outline">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-movistar-gray-med">No tienes productos en el carrito.</p>
        <Link href="/catalogo" className="btn-primary mt-4">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-bold text-movistar-navy">
        Proceso de pago
      </h1>
      <form onSubmit={pay} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Envío: transportista + dirección */}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-movistar-navy">
              Envío
            </h2>

            {/* Transportista */}
            <p className="mb-2 text-sm font-semibold text-movistar-navy">
              Transportista
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {COURIERS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCourierId(c.id)}
                  className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-colors ${
                    courierId === c.id
                      ? "border-movistar-blue bg-movistar-blue/5"
                      : "border-gray-200"
                  }`}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-movistar-navy">{c.label}</p>
                    <p className="text-xs text-movistar-gray-med">{c.desc} · {c.eta}</p>
                  </div>
                  <span className="text-sm font-bold text-movistar-navy">
                    {formatCurrency(c.cost)}
                  </span>
                </button>
              ))}
            </div>

            {/* Dirección de envío */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-movistar-navy">
                  Dirección de envío
                </p>
                {savedAddresses.length > 0 && (
                  <div className="flex gap-1 rounded-full bg-movistar-gray p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setAddressMode("saved")}
                      className={`rounded-full px-3 py-1 font-semibold ${
                        addressMode === "saved" ? "bg-movistar-blue text-white" : "text-movistar-navy"
                      }`}
                    >
                      Mis direcciones
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressMode("new")}
                      className={`rounded-full px-3 py-1 font-semibold ${
                        addressMode === "new" ? "bg-movistar-blue text-white" : "text-movistar-navy"
                      }`}
                    >
                      Nueva dirección
                    </button>
                  </div>
                )}
              </div>

              {addressMode === "saved" && savedAddresses.length > 0 ? (
                <div className="space-y-2">
                  {savedAddresses.map((a) => (
                    <label
                      key={a.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 ${
                        selectedAddressId === a.id
                          ? "border-movistar-blue bg-movistar-blue/5"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === a.id}
                        onChange={() => setSelectedAddressId(a.id)}
                        className="mt-1 accent-movistar-blue"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-movistar-navy">
                          {a.alias} {a.default && <span className="badge bg-movistar-blue text-white">Principal</span>}
                        </p>
                        <p className="text-movistar-gray-med">
                          {a.line1}, {a.district}, {a.city}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm sm:col-span-2">
                    Dirección
                    <input
                      value={newAddress.line1}
                      onChange={(e) => setNewAddress((p) => ({ ...p, line1: e.target.value }))}
                      className="input mt-1"
                      placeholder="Av. / Calle y número"
                      required={addressMode === "new"}
                    />
                  </label>
                  <label className="block text-sm">
                    Distrito
                    <input
                      value={newAddress.district}
                      onChange={(e) => setNewAddress((p) => ({ ...p, district: e.target.value }))}
                      className="input mt-1"
                      placeholder="Distrito"
                      required={addressMode === "new"}
                    />
                  </label>
                  <label className="block text-sm">
                    Ciudad
                    <input
                      value={newAddress.city}
                      onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                      className="input mt-1"
                      placeholder="Ciudad"
                      required={addressMode === "new"}
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    Referencia (opcional)
                    <input
                      value={newAddress.reference}
                      onChange={(e) => setNewAddress((p) => ({ ...p, reference: e.target.value }))}
                      className="input mt-1"
                      placeholder="Ej. frente al parque"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Pagos asociados */}
          <div className="card p-6">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-bold text-movistar-navy">
                Pagos asociados
              </h2>
              <span className="text-xs text-movistar-gray-med">
                Cobro compartido entre varias fuentes
              </span>
            </div>
            <p className="mb-4 text-sm text-movistar-gray-med">
              Selecciona 2 o más fuentes y reparte el monto a pagar. La suma debe
              igualar el total.
            </p>

            <div className="space-y-3">
              {SOURCES.map((s) => {
                const active = !!selected[s.id];
                return (
                  <div
                    key={s.id}
                    className={`rounded-xl border-2 p-3 transition-colors ${
                      active ? "border-movistar-blue bg-movistar-blue/5" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggle(s.id)}
                        className="h-5 w-5 accent-movistar-blue"
                      />
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                        style={{ backgroundColor: `${s.color}22` }}
                      >
                        {s.icon}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-movistar-navy">
                          {s.label}
                        </p>
                        <p className="text-xs text-movistar-gray-med">{s.desc}</p>
                      </div>
                      {active ? (
                        <span className="badge bg-movistar-green text-white">
                          Aplicado
                        </span>
                      ) : (
                        <span className="badge bg-movistar-blue/10 text-movistar-blue">
                          Disponible
                        </span>
                      )}
                    </div>

                    {active && (
                      <div className="mt-3 flex items-center gap-2 pl-16">
                        <span className="text-sm text-movistar-gray-med">S/</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={amounts[s.id] ?? ""}
                          onChange={(e) => setAmount(s.id, e.target.value)}
                          className="input w-40"
                          placeholder="0.00"
                        />
                        <span className="text-xs text-movistar-gray-med">
                          asignado a esta fuente
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Acciones rápidas */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={splitEven} className="btn-outline px-4 py-1.5 text-xs">
                Dividir en partes iguales
              </button>
              <button type="button" onClick={fillRemaining} className="btn-outline px-4 py-1.5 text-xs">
                Completar restante
              </button>
            </div>

            {/* Distribución del pago */}
            {activeIds.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-movistar-navy">
                  Distribución del pago
                </p>
                <div className="flex h-4 overflow-hidden rounded-full bg-gray-100">
                  {activeIds.map((id) => {
                    const src = SOURCES.find((s) => s.id === id);
                    const amt = Number(amounts[id]) || 0;
                    const pct = total > 0 ? (amt / total) * 100 : 0;
                    return (
                      <div
                        key={id}
                        style={{ width: `${pct}%`, backgroundColor: src?.color }}
                        title={`${src?.label}: ${formatCurrency(amt)}`}
                      />
                    );
                  })}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {activeIds.map((id) => {
                    const src = SOURCES.find((s) => s.id === id);
                    return (
                      <span key={id} className="flex items-center gap-1">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: src?.color }}
                        />
                        {src?.label}: {formatCurrency(Number(amounts[id]) || 0)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Estado de balance */}
            <div
              className={`mt-4 rounded-lg p-3 text-sm ${
                balanced
                  ? "bg-movistar-green/10 text-movistar-green"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {balanced ? (
                <>✓ La distribución cuadra con el total ({formatCurrency(total)}).</>
              ) : (
                <>
                  Asignado {formatCurrency(assigned)} de {formatCurrency(total)}.{" "}
                  {remaining > 0
                    ? `Falta asignar ${formatCurrency(remaining)}.`
                    : `Te excedes por ${formatCurrency(Math.abs(remaining))}.`}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Resumen */}
        <aside className="card h-fit space-y-4 p-6">
          <h2 className="text-lg font-bold text-movistar-navy">Tu pedido</h2>
          <div className="max-h-48 space-y-2 overflow-y-auto text-sm">
            {cart.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span className="line-clamp-1">{i.qty}× {i.name}</span>
                <span>{formatCurrency(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t pt-3 text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-movistar-green">
              <span>Descuento {voucher ? `(${voucher.code})` : ""}</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Envío ({courier.label})</span>
            <span>{shipping === 0 ? "Gratis" : formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between border-t pt-3 text-lg font-bold text-movistar-navy">
            <span>Total a pagar</span>
            <span>{formatCurrency(total)}</span>
          </div>
          {!addressComplete && (
            <p className="text-xs text-yellow-700">
              Completa la dirección de envío para continuar.
            </p>
          )}
          <button
            type="submit"
            disabled={!canPay}
            className={`w-full ${canPay ? "btn-green" : "btn-outline cursor-not-allowed opacity-50"}`}
          >
            {!balanced
              ? "Reparte el total para pagar"
              : !addressComplete
              ? "Falta la dirección de envío"
              : `Pagar ${formatCurrency(total)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}
