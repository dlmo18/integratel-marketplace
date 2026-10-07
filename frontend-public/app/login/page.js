"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { findUserByCredentials } from "@/lib/data";

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
    <div className="container-page grid min-h-[70vh] items-center py-10 lg:grid-cols-2 lg:gap-12">
      <div className="hidden lg:block">
        <h1 className="text-4xl font-black text-movistar-navy">
          Bienvenido de nuevo
        </h1>
        <p className="mt-3 text-movistar-gray-med">
          Ingresa para ver tus compras, gestionar tus ventas y administrar tu
          cuenta en el marketplace.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/banners/hero-compras.jpg"
          alt="Login"
          className="mt-6 rounded-3xl object-cover shadow-card"
        />
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-movistar-navy">Iniciar sesión</h2>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Correo electrónico
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-1"
                placeholder="tu@correo.com"
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input mt-1"
                placeholder="••••••••"
                required
              />
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Ingresar
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-movistar-gray p-4 text-sm">
            <p className="mb-2 font-semibold text-movistar-navy">Cuentas demo:</p>
            <button onClick={() => quick("comprador@demo.com")} className="block text-movistar-blue hover:underline">
              comprador@demo.com (Regular)
            </button>
            <button onClick={() => quick("vip@demo.com")} className="block text-movistar-blue hover:underline">
              vip@demo.com (VIP · tema negro)
            </button>
            <button onClick={() => quick("seller@demo.com")} className="block text-movistar-blue hover:underline">
              seller@demo.com (Seller · tema Empresas)
            </button>
            <p className="mt-1 text-movistar-gray-med">Contraseña: demo1234</p>
          </div>

          <p className="mt-6 text-center text-sm text-movistar-gray-med">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="font-semibold text-movistar-blue hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
