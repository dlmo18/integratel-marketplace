"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";

export default function RegisterClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { login } = useStore();
  const [type, setType] = useState(params.get("tipo") === "seller" ? "seller" : "buyer");
  const [form, setForm] = useState({ name: "", email: "", password: "", storeName: "", ruc: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const id = `${type}-demo-${Date.now()}`;
    const newUser = {
      id,
      type,
      // Los compradores nuevos empiezan en el nivel Blue (N1).
      tier: type === "seller" ? "seller" : "blue",
      name: form.name,
      email: form.email,
      avatar: type === "seller" ? "/img/avatars/seller-001.jpg" : "/img/avatars/user-001.jpg",
      storeName: type === "seller" ? form.storeName : undefined,
      ruc: type === "seller" ? form.ruc : undefined,
      addresses: [],
      paymentMethods: []
    };
    login(newUser);
    router.push("/cuenta");
  };

  return (
    <div style={{ margin: "0 auto", width: "100%", maxWidth: 520 }}>
      <div className="md-card md-card-elevated md-card-pad">
        <h2 className="md-headline-small">
          {type === "seller" ? "Darse de alta como Seller" : "Registrar cuenta"}
        </h2>
        <p className="md-muted md-body-medium" style={{ marginTop: 4 }}>
          Crea tu cuenta para {type === "seller" ? "vender" : "comprar"} en el marketplace.
        </p>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, borderRadius: "var(--md-shape-full)", background: "var(--md-surface-container-high)", padding: 4 }}>
          <button
            onClick={() => setType("buyer")}
            className="md-state"
            style={{ borderRadius: "var(--md-shape-full)", padding: "8px 0", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", background: type === "buyer" ? "var(--md-primary)" : "transparent", color: type === "buyer" ? "var(--md-on-primary)" : "var(--md-on-surface)" }}
          >
            Comprador
          </button>
          <button
            onClick={() => setType("seller")}
            className="md-state"
            style={{ borderRadius: "var(--md-shape-full)", padding: "8px 0", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", background: type === "seller" ? "var(--md-primary)" : "transparent", color: type === "seller" ? "var(--md-on-primary)" : "var(--md-on-surface)" }}
          >
            Seller
          </button>
        </div>

        <form onSubmit={submit} className="md-stack" style={{ marginTop: 24 }}>
          <div>
            <label className="md-form-label">Nombre completo</label>
            <input value={form.name} onChange={set("name")} className="md-input" required placeholder="Tu nombre" />
          </div>
          <div>
            <label className="md-form-label">Correo electrónico</label>
            <input type="email" value={form.email} onChange={set("email")} className="md-input" required placeholder="tu@correo.com" />
          </div>
          <div>
            <label className="md-form-label">Contraseña</label>
            <input type="password" value={form.password} onChange={set("password")} className="md-input" required placeholder="••••••••" />
          </div>

          {type === "seller" && (
            <>
              <div>
                <label className="md-form-label">Nombre de la tienda</label>
                <input value={form.storeName} onChange={set("storeName")} className="md-input" required placeholder="Mi tienda" />
              </div>
              <div>
                <label className="md-form-label">RUC</label>
                <input value={form.ruc} onChange={set("ruc")} className="md-input" placeholder="20xxxxxxxxx" />
              </div>
            </>
          )}

          <button type="submit" className={`md-btn md-btn-block md-state ${type === "seller" ? "md-btn-green" : "md-btn-filled"}`}>
            {type === "seller" ? "Crear cuenta de Seller" : "Crear cuenta"}
          </button>
        </form>

        <p className="md-center md-muted md-body-medium" style={{ marginTop: 24 }}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="md-primary-text" style={{ fontWeight: 600 }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
