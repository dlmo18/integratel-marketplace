"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getPoints, getRewards } from "@/lib/data";
import { formatDate } from "@/lib/format";
import StatCard from "@/components/StatCard";

function randomCode() {
  return "CANJE" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function PointsPage() {
  const { user } = useStore();
  const data = useMemo(() => getPoints(user), [user]);
  const rewards = getRewards();

  const [balance, setBalance] = useState(data.balance);
  const [history, setHistory] = useState(data.history);
  const [redeemed, setRedeemed] = useState([]);
  const [message, setMessage] = useState(null);

  const earned = history
    .filter((h) => h.type === "ganado")
    .reduce((a, h) => a + h.points, 0);

  const redeem = (reward) => {
    if (balance < reward.cost) {
      setMessage({ type: "error", text: "No tienes puntos suficientes para este canje." });
      return;
    }
    const code = randomCode();
    const label =
      reward.discountType === "percent"
        ? `Cupón ${reward.value}% de descuento`
        : `Voucher S/ ${reward.value} de descuento`;
    setBalance((b) => b - reward.cost);
    setHistory((h) => [
      {
        id: "PT-" + Date.now(),
        date: new Date().toISOString().slice(0, 10),
        concept: `Canje: ${label}`,
        points: -reward.cost,
        type: "canjeado"
      },
      ...h
    ]);
    setRedeemed((r) => [{ code, label, cost: reward.cost }, ...r]);
    setMessage({
      type: "success",
      text: `¡Canje exitoso! Se generó el voucher ${code}. Revísalo en la sección Vouchers.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-movistar-navy">Canje de puntos</h2>
        <Link href="/cuenta/vouchers" className="text-sm font-semibold text-movistar-blue hover:underline">
          Ver mis vouchers →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Puntos disponibles" value={balance.toLocaleString("es-PE")} icon="⭐" accent="blue" />
        <StatCard label="Puntos ganados" value={earned.toLocaleString("es-PE")} icon="📈" accent="green" />
        <StatCard label="Vouchers canjeados hoy" value={redeemed.length} icon="🎟️" accent="navy" />
      </div>

      {message && (
        <div
          className={`rounded-xl p-4 text-sm ${
            message.type === "success"
              ? "bg-movistar-green/10 text-movistar-green"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Catálogo de recompensas */}
      <div>
        <h3 className="mb-3 font-bold text-movistar-navy">Canjea tus puntos por vouchers</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((rw) => {
            const canRedeem = balance >= rw.cost;
            return (
              <div key={rw.id} className="card flex flex-col p-5">
                <span className="text-3xl">{rw.discountType === "percent" ? "🏷️" : "💵"}</span>
                <p className="mt-2 font-semibold text-movistar-navy">{rw.title}</p>
                <p className="mt-1 text-sm text-movistar-gray-med">
                  {rw.cost.toLocaleString("es-PE")} puntos
                </p>
                <button
                  onClick={() => redeem(rw)}
                  disabled={!canRedeem}
                  className={`mt-auto ${canRedeem ? "btn-primary" : "btn-outline cursor-not-allowed opacity-50"} mt-4`}
                >
                  {canRedeem ? "Canjear" : "Puntos insuficientes"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vouchers recién generados */}
      {redeemed.length > 0 && (
        <div className="card p-5">
          <h3 className="mb-3 font-bold text-movistar-navy">Vouchers generados en esta sesión</h3>
          <ul className="space-y-2 text-sm">
            {redeemed.map((r) => (
              <li key={r.code} className="flex items-center justify-between rounded-lg bg-movistar-gray p-3">
                <span className="font-mono font-bold text-movistar-navy">{r.code}</span>
                <span>{r.label}</span>
                <span className="text-movistar-gray-med">-{r.cost} pts</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Historial */}
      <div className="card p-5">
        <h3 className="mb-3 font-bold text-movistar-navy">Historial de puntos</h3>
        <div className="space-y-2">
          {history.map((h) => (
            <div key={h.id} className="flex items-center justify-between border-b py-2 text-sm last:border-0">
              <div>
                <p className="font-medium text-movistar-navy">{h.concept}</p>
                <p className="text-xs text-movistar-gray-med">{formatDate(h.date)}</p>
              </div>
              <span className={`font-bold ${h.points >= 0 ? "text-movistar-green" : "text-red-500"}`}>
                {h.points >= 0 ? "+" : ""}
                {h.points.toLocaleString("es-PE")} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
