"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN = { email: "admin@integratel.demo", password: "admin1234" };

export default function ManagerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (email === ADMIN.email && password === ADMIN.password) {
      router.push("/dashboard");
    } else {
      setError("Credenciales inválidas. Usa las credenciales demo.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-movistar-navy to-movistar-blue-dark p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <span className="text-2xl font-black text-movistar-navy">
            integra<span className="text-movistar-blue">tel</span>
          </span>
          <p className="mt-1 text-sm text-gray-500">Panel de administración</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium text-movistar-navy">
            Correo del administrador
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-1"
              placeholder="admin@integratel.demo"
              required
            />
          </label>
          <label className="block text-sm font-medium text-movistar-navy">
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
          <button type="submit" className="btn-primary">
            Ingresar al panel
          </button>
        </form>

        <div className="mt-6 rounded-xl bg-movistar-gray p-4 text-sm">
          <p className="font-semibold text-movistar-navy">Credenciales demo:</p>
          <p className="text-gray-600">admin@integratel.demo</p>
          <p className="text-gray-600">Contraseña: admin1234</p>
        </div>
      </div>
    </div>
  );
}
