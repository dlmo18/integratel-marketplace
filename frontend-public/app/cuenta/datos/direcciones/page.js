"use client";

import { useStore } from "@/context/StoreContext";

export default function AddressesPage() {
  const { user } = useStore();
  const addresses = user?.addresses || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-movistar-navy">Direcciones</h2>
        <button className="btn-primary">+ Agregar dirección</button>
      </div>

      {addresses.length === 0 ? (
        <div className="card p-8 text-center text-movistar-gray-med">
          No tienes direcciones registradas.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-movistar-navy">{a.alias}</p>
                {a.default && (
                  <span className="badge bg-movistar-blue text-white">Principal</span>
                )}
              </div>
              <p className="mt-2 text-sm text-movistar-gray-med">
                {a.line1}
                <br />
                {a.district}, {a.city}
                <br />
                {a.region} · {a.zip}
              </p>
              <div className="mt-3 flex gap-3 text-sm">
                <button className="text-movistar-blue hover:underline">Editar</button>
                <button className="text-red-500 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
