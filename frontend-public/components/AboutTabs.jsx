"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/nosotros/acerca-de", label: "Acerca de" },
  { href: "/nosotros/terminos", label: "Términos y condiciones" },
  { href: "/nosotros/privacidad", label: "Políticas de privacidad" },
  { href: "/nosotros/sellers", label: "Políticas de Sellers" }
];

export default function AboutTabs() {
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
