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
    <div className="md-stack">
      <div className="md-row-between">
        <h2 className="md-title-large" style={{ margin: 0 }}>Canje de puntos</h2>
        <Link href="/cuenta/vouchers" className="md-primary-text md-title-small">
          Ver mis vouchers →
        </Link>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <StatCard label="Puntos disponibles" value={balance.toLocaleString("es-PE")} icon={<span className="material-symbols-outlined filled">star</span>} accent="primary" />
        <StatCard label="Puntos ganados" value={earned.toLocaleString("es-PE")} icon={<span className="material-symbols-outlined">trending_up</span>} accent="secondary" />
        <StatCard label="Vouchers canjeados hoy" value={redeemed.length} icon={<span className="material-symbols-outlined">confirmation_number</span>} accent="primary" />
      </div>

      {message && (
        <div className={`md-alert ${message.type === "success" ? "md-alert-success" : "md-alert-error"}`}>
          {message.text}
        </div>
      )}

      {/* Catálogo de recompensas */}
      <div>
        <h3 className="md-title-medium" style={{ margin: "0 0 12px" }}>Canjea tus puntos por vouchers</h3>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {rewards.map((rw) => {
            const canRedeem = balance >= rw.cost;
            return (
              <div key={rw.id} className="md-card md-card-elevated md-card-pad md-col">
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: "var(--md-primary)" }}>{rw.discountType === "percent" ? "sell" : "payments"}</span>
                <p className="md-title-small" style={{ marginTop: 8 }}>{rw.title}</p>
                <p className="md-muted md-body-medium" style={{ marginTop: 4 }}>
                  {rw.cost.toLocaleString("es-PE")} puntos
                </p>
                <button
                  onClick={() => redeem(rw)}
                  disabled={!canRedeem}
                  className={`md-btn md-state ${canRedeem ? "md-btn-filled" : "md-btn-outlined"}`}
                  style={{ marginTop: "auto", marginBlockStart: 16 }}
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
        <div className="md-card md-card-elevated md-card-pad">
          <h3 className="md-title-medium" style={{ margin: "0 0 12px" }}>Vouchers generados en esta sesión</h3>
          <ul className="md-stack" style={{ listStyle: "none", margin: 0, padding: 0, gap: 8 }}>
            {redeemed.map((r) => (
              <li key={r.code} className="md-row-between md-body-medium" style={{ borderRadius: "var(--md-shape-md)", background: "var(--md-surface-container)", padding: 12 }}>
                <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{r.code}</span>
                <span>{r.label}</span>
                <span className="md-muted">-{r.cost} pts</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Historial */}
      <div className="md-card md-card-elevated md-card-pad">
        <h3 className="md-title-medium" style={{ margin: "0 0 12px" }}>Historial de puntos</h3>
        <div>
          {history.map((h) => (
            <div key={h.id} className="md-row-between md-body-medium" style={{ borderBottom: "1px solid var(--md-outline-variant)", paddingBlock: 8 }}>
              <div>
                <p className="md-title-small" style={{ margin: 0 }}>{h.concept}</p>
                <p className="md-muted md-body-small" style={{ margin: 0 }}>{formatDate(h.date)}</p>
              </div>
              <span style={{ fontWeight: 700, color: h.points >= 0 ? "var(--md-secondary)" : "var(--md-error)" }}>
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
