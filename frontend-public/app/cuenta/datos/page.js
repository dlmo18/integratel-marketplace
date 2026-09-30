"use client";

import { useStore } from "@/context/StoreContext";

export default function PersonalDataPage() {
  const { user } = useStore();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-movistar-navy">Datos personales</h2>
      <div className="card p-6">
        <div className="flex items-center gap-4 border-b pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div>
            <p className="font-bold text-movistar-navy">{user?.name}</p>
            <p className="text-sm capitalize text-movistar-gray-med">
              {user?.type === "seller" ? "Cuenta Seller" : "Cuenta Comprador"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Nombre completo
            <input className="input mt-1" defaultValue={user?.name} />
          </label>
          <label className="text-sm">
            Correo electrónico
            <input className="input mt-1" defaultValue={user?.email} />
          </label>
          <label className="text-sm">
            Teléfono
            <input className="input mt-1" defaultValue={user?.phone || ""} placeholder="+51 9XX XXX XXX" />
          </label>
          {user?.type === "seller" && (
            <>
              <label className="text-sm">
                Nombre de tienda
                <input className="input mt-1" defaultValue={user?.storeName || ""} />
              </label>
              <label className="text-sm">
                RUC
                <input className="input mt-1" defaultValue={user?.ruc || ""} />
              </label>
            </>
          )}
        </div>
        <button className="btn-primary mt-4">Guardar cambios</button>
      </div>
    </div>
  );
}
