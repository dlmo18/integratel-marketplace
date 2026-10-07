"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import AccountSidebar from "@/components/AccountSidebar";

export default function AccountLayout({ children }) {
  const { user, ready } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready) {
    return <div className="container-page py-20 text-center">Cargando…</div>;
  }

  if (!user) {
    return (
      <div className="container-page py-20 text-center text-movistar-gray-med">
        Redirigiendo al inicio de sesión…
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-bold text-movistar-navy">Mi cuenta</h1>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <AccountSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}
