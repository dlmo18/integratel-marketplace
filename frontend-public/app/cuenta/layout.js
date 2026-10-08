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
    return <div className="md-container md-page md-center" style={{ paddingBlock: 80 }}>Cargando…</div>;
  }

  if (!user) {
    return (
      <div className="md-container md-page md-center md-muted" style={{ paddingBlock: 80 }}>
        Redirigiendo al inicio de sesión…
      </div>
    );
  }

  return (
    <div className="md-container md-page">
      <h1 className="md-headline-large" style={{ marginBottom: 24 }}>Mi cuenta</h1>
      <div className="md-with-aside">
        <AccountSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}
