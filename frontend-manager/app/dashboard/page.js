"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ManagerDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-movistar-gray">
      <header className="flex items-center justify-between bg-movistar-navy px-6 py-4 text-white">
        <span className="text-xl font-black">
          integra<span className="text-movistar-blue">tel</span>{" "}
          <span className="text-sm font-normal">· Manager</span>
        </span>
        <button
          onClick={() => router.push("/")}
          className="rounded-full border border-white px-4 py-1.5 text-sm hover:bg-white hover:text-movistar-navy"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-2xl font-bold text-movistar-navy">
          Bienvenido al panel de administración
        </h1>
        <p className="mt-2 text-gray-600">
          Este es un panel demostrativo. En esta versión piloto solo está
          habilitado el inicio de sesión del administrador.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {["Usuarios", "Productos", "Órdenes"].map((m) => (
            <div key={m} className="rounded-2xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Módulo</p>
              <p className="text-lg font-bold text-movistar-navy">{m}</p>
              <p className="mt-2 text-xs text-gray-400">Próximamente</p>
            </div>
          ))}
        </div>

        <Link
          href="http://localhost:3000"
          className="mt-8 inline-block text-sm font-semibold text-movistar-blue hover:underline"
        >
          ← Ir al sitio público (localhost:3000)
        </Link>
      </main>
    </div>
  );
}
