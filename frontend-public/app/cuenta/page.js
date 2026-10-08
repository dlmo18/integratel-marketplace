"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getTier, BUYER_TIERS, TIERS } from "@/lib/tiers";

export default function AccountHome() {
  const { user, tier, isSeller } = useStore();
  const info = getTier(tier);

  return (
    <div className="md-stack" style={{ gap: 24 }}>
      {/* Tarjeta de bienvenida con escala de niveles */}
      <div className="md-card md-card-pad" style={{ background: "linear-gradient(135deg, var(--md-hero-from), var(--md-hero-to))", color: "#fff" }}>
        <div className="md-row" style={{ gap: 12 }}>
          <span className={`tier-chip tier-${info.key}`}>
            <span className="material-symbols-outlined filled">{info.icon}</span>
            {info.label}
          </span>
        </div>
        <h2 className="md-headline-small" style={{ marginTop: 12 }}>Hola, {user?.name} 👋</h2>
        <p style={{ marginTop: 4, color: "rgba(255,255,255,0.85)" }}>
          {isSeller
            ? "Gestiona tus ventas, productos y transacciones desde aquí."
            : `Eres ${info.label}. Disfruta hasta ${info.discount}% en promos y beneficios exclusivos.`}
        </p>

        {/* Escala de niveles (solo compradores) */}
        {!isSeller && (
          <div style={{ marginTop: 20, maxWidth: 420 }}>
            <div className="tier-steps">
              {BUYER_TIERS.map((t, i) => {
                const reached = TIERS[t].level <= info.level;
                return (
                  <Fragment key={t}>
                    {i > 0 && (
                      <span
                        className="tier-step-line"
                        style={{ background: reached ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)" }}
                      />
                    )}
                    <span
                      className="tier-step"
                      title={TIERS[t].label}
                      style={{ borderColor: "#fff", background: reached ? "#fff" : "transparent" }}
                    />
                  </Fragment>
                );
              })}
            </div>
            <div className="md-row-between" style={{ marginTop: 8, fontSize: "0.7rem", color: "rgba(255,255,255,0.85)" }}>
              {BUYER_TIERS.map((t) => (
                <span key={t} style={{ fontWeight: t === info.key ? 700 : 400 }}>{TIERS[t].short}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <Link href="/cuenta/compras" className="md-card md-card-elevated md-card-pad md-state">
          <span className="material-symbols-outlined" style={{ fontSize: 32, color: "var(--md-primary)" }}>shopping_bag</span>
          <h3 className="md-title-medium" style={{ marginTop: 8 }}>Mis compras</h3>
          <p className="md-muted md-body-medium" style={{ margin: 0 }}>Historial, entregas y devoluciones</p>
        </Link>

        {isSeller && (
          <Link href="/cuenta/ventas" className="md-card md-card-elevated md-card-pad md-state">
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: "var(--md-primary)" }}>work</span>
            <h3 className="md-title-medium" style={{ marginTop: 8 }}>Mis ventas</h3>
            <p className="md-muted md-body-medium" style={{ margin: 0 }}>Productos, ventas y pagos</p>
          </Link>
        )}

        <Link href="/cuenta/puntos" className="md-card md-card-elevated md-card-pad md-state">
          <span className="material-symbols-outlined" style={{ fontSize: 32, color: "var(--md-primary)" }}>stars</span>
          <h3 className="md-title-medium" style={{ marginTop: 8 }}>Recompensas</h3>
          <p className="md-muted md-body-medium" style={{ margin: 0 }}>Puntos y vouchers</p>
        </Link>

        <Link href="/cuenta/datos" className="md-card md-card-elevated md-card-pad md-state">
          <span className="material-symbols-outlined" style={{ fontSize: 32, color: "var(--md-primary)" }}>settings</span>
          <h3 className="md-title-medium" style={{ marginTop: 8 }}>Mis datos</h3>
          <p className="md-muted md-body-medium" style={{ margin: 0 }}>Perfil, direcciones y pagos</p>
        </Link>
      </div>
    </div>
  );
}
