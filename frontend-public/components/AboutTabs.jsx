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
