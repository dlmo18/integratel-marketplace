"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/soporte/contactanos", label: "Contáctanos" },
  { href: "/soporte/cambios-devoluciones", label: "Cambios y devoluciones" },
  { href: "/soporte/seguimiento", label: "Seguimiento de pedidos" },
  { href: "/soporte/vender", label: "Vender en marketplace" }
];

export default function SupportTabs() {
  const pathname = usePathname();
  return (
    <div className="md-tabs" style={{ marginBottom: 24 }}>
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`md-tab ${pathname === t.href ? "active" : ""}`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
