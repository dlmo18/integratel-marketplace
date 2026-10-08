"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { findUserByCredentials } from "@/lib/data";

const demoAccounts = [
  { mail: "comprador@demo.com", label: "Movistar Blue (Nivel 1)" },
  { mail: "gold@demo.com", label: "Movistar Gold (Nivel 2)" },
  { mail: "platinium@demo.com", label: "Movistar Platinium (Nivel 3)" },
  { mail: "black@demo.com", label: "Movistar Black (Nivel 4)" },
  { mail: "seller@demo.com", label: "Seller (tema Empresas)" }
];

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const user = findUserByCredentials(email, password);
    if (user) {
      const { password: _pw, ...safe } = user;
      login(safe);
      router.push("/cuenta");
    } else {
      setError("Credenciales incorrectas. Usa las cuentas demo.");
    }
  };

  const quick = (mail) => {
    setEmail(mail);
    setPassword("demo1234");
  };

  return (
    <div className="md-container md-page" style={{ display: "grid", gap: 48, alignItems: "center", minHeight: "70vh", gridTemplateColumns: "1fr" }}>
      <div className="login-grid">
        <div className="login-hero">
          <h1 className="md-display-small" style={{ fontWeight: 800 }}>Bienvenido de nuevo</h1>
          <p className="md-muted" style={{ marginTop: 12 }}>
            Ingresa para ver tus compras, gestionar tus ventas y administrar tu
            cuenta en el marketplace.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/banners/hero-compras.jpg" alt="Login" style={{ marginTop: 24, borderRadius: "var(--md-shape-xl)", objectFit: "cover", boxShadow: "var(--md-elev-2)", width: "100%" }} />
        </div>

        <div style={{ margin: "0 auto", width: "100%", maxWidth: 420 }}>
          <div className="md-card md-card-elevated md-card-pad">
            <h2 className="md-headline-small">Iniciar sesión</h2>
            <form onSubmit={submit} className="md-stack" style={{ marginTop: 24 }}>
              <div>
                <label className="md-form-label">Correo electrónico</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="md-input" placeholder="tu@correo.com" required />
              </div>
              <div>
                <label className="md-form-label">Contraseña</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="md-input" placeholder="••••••••" required />
              </div>
              {error && <p style={{ fontSize: "0.85rem", color: "var(--md-error)" }}>{error}</p>}
              <button type="submit" className="md-btn md-btn-filled md-btn-block md-state">Ingresar</button>
            </form>

            <div className="md-alert md-alert-info" style={{ marginTop: 24 }}>
              <p className="md-title-small" style={{ margin: "0 0 8px" }}>Cuentas demo:</p>
              {demoAccounts.map((a) => (
                <button
                  key={a.mail}
                  onClick={() => quick(a.mail)}
                  style={{ display: "block", background: "none", border: "none", padding: "2px 0", cursor: "pointer", color: "var(--md-primary)", fontSize: "0.85rem", textAlign: "left" }}
                >
                  {a.mail} — {a.label}
                </button>
              ))}
              <p className="md-muted" style={{ marginTop: 6, fontSize: "0.8rem" }}>Contraseña: demo1234</p>
            </div>

            <p className="md-center md-muted md-body-medium" style={{ marginTop: 24 }}>
              ¿No tienes cuenta?{" "}
              <Link href="/registro" className="md-primary-text" style={{ fontWeight: 600 }}>Regístrate</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
