"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function AccountHome() {
  const { user } = useStore();

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-r from-movistar-navy to-movistar-blue p-8 text-white">
        <h2 className="text-2xl font-bold">Hola, {user?.name} 👋</h2>
        <p className="mt-1 text-white/80">
          {user?.type === "seller"
            ? "Gestiona tus ventas, productos y transacciones desde aquí."
            : "Revisa tus compras, entregas y datos desde aquí."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/cuenta/compras" className="card p-6 transition-transform hover:-translate-y-1">
          <span className="text-3xl">🛍️</span>
          <h3 className="mt-2 font-bold text-movistar-navy">Mis compras</h3>
          <p className="text-sm text-movistar-gray-med">Historial, entregas y devoluciones</p>
        </Link>

        {user?.type === "seller" && (
          <Link href="/cuenta/ventas" className="card p-6 transition-transform hover:-translate-y-1">
            <span className="text-3xl">💼</span>
            <h3 className="mt-2 font-bold text-movistar-navy">Mis ventas</h3>
            <p className="text-sm text-movistar-gray-med">Productos, ventas y pagos</p>
          </Link>
        )}

        <Link href="/cuenta/datos" className="card p-6 transition-transform hover:-translate-y-1">
          <span className="text-3xl">⚙️</span>
          <h3 className="mt-2 font-bold text-movistar-navy">Mis datos</h3>
          <p className="text-sm text-movistar-gray-med">Perfil, direcciones y pagos</p>
        </Link>
      </div>
    </div>
  );
}
