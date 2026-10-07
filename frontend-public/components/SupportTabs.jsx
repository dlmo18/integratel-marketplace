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
    <div className="flex flex-wrap gap-2 border-b pb-3">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            pathname === t.href
              ? "bg-movistar-blue text-white"
              : "bg-movistar-gray text-movistar-navy hover:bg-movistar-blue/10"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
