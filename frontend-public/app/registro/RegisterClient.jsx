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
    // Demo: crea una sesión en memoria/localStorage (no persiste en JSON estático)
    const id = `${type}-demo-${Date.now()}`;
    const newUser = {
      id,
      type,
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
    <div className="mx-auto w-full max-w-lg">
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-movistar-navy">
          {type === "seller" ? "Darse de alta como Seller" : "Registrar cuenta"}
        </h2>
        <p className="mt-1 text-sm text-movistar-gray-med">
          Crea tu cuenta para {type === "seller" ? "vender" : "comprar"} en el marketplace.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-full bg-movistar-gray p-1">
          <button
            onClick={() => setType("buyer")}
            className={`rounded-full py-2 text-sm font-semibold ${
              type === "buyer" ? "bg-movistar-blue text-white" : "text-movistar-navy"
            }`}
          >
            Comprador
          </button>
          <button
            onClick={() => setType("seller")}
            className={`rounded-full py-2 text-sm font-semibold ${
              type === "seller" ? "bg-movistar-blue text-white" : "text-movistar-navy"
            }`}
          >
            Seller
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Nombre completo
            <input value={form.name} onChange={set("name")} className="input mt-1" required placeholder="Tu nombre" />
          </label>
          <label className="block text-sm font-medium">
            Correo electrónico
            <input type="email" value={form.email} onChange={set("email")} className="input mt-1" required placeholder="tu@correo.com" />
          </label>
          <label className="block text-sm font-medium">
            Contraseña
            <input type="password" value={form.password} onChange={set("password")} className="input mt-1" required placeholder="••••••••" />
          </label>

          {type === "seller" && (
            <>
              <label className="block text-sm font-medium">
                Nombre de la tienda
                <input value={form.storeName} onChange={set("storeName")} className="input mt-1" required placeholder="Mi tienda" />
              </label>
              <label className="block text-sm font-medium">
                RUC
                <input value={form.ruc} onChange={set("ruc")} className="input mt-1" placeholder="20xxxxxxxxx" />
              </label>
            </>
          )}

          <button type="submit" className={type === "seller" ? "btn-green w-full" : "btn-primary w-full"}>
            {type === "seller" ? "Crear cuenta de Seller" : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-movistar-gray-med">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-movistar-blue hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
