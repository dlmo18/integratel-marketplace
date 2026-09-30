import Link from "next/link";

const columns = [
  {
    title: "Nosotros",
    links: [
      { href: "/nosotros/acerca-de", label: "Acerca de" },
      { href: "/nosotros/terminos", label: "Términos y condiciones" },
      { href: "/nosotros/privacidad", label: "Políticas de privacidad" },
      { href: "/nosotros/sellers", label: "Políticas de Sellers" }
    ]
  },
  {
    title: "Soporte",
    links: [
      { href: "/soporte/contactanos", label: "Contáctanos" },
      { href: "/soporte/cambios-devoluciones", label: "Cambios y devoluciones" },
      { href: "/soporte/seguimiento", label: "Seguimiento de pedidos" },
      { href: "/soporte/vender", label: "Vender en el marketplace" }
    ]
  },
  {
    title: "Mi cuenta",
    links: [
      { href: "/cuenta", label: "Panel" },
      { href: "/cuenta/compras", label: "Mis compras" },
      { href: "/cuenta/ventas", label: "Mis ventas" },
      { href: "/cuenta/datos", label: "Mis datos" }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-movistar-blue-dark text-white">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="text-2xl font-black">
            integra<span className="text-movistar-blue">tel</span>
          </span>
          <p className="mt-3 text-sm text-white/70">
            El marketplace donde encuentras equipos Movistar y productos de
            miles de sellers. Compra fácil, vende sin límites.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-movistar-blue">
              {col.title}
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-white/60 sm:flex-row">
          <span>© {new Date().getFullYear()} Integratel Marketplace. Proyecto demo.</span>
          <span>Hecho con Next.js + Tailwind · Línea gráfica inspirada en Movistar</span>
        </div>
      </div>
    </footer>
  );
}
