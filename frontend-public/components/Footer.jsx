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
    <footer className="ftr">
      <div className="md-container">
        <div className="ftr-grid">
          <div className="ftr-brand">
            <span className="md-title-large" style={{ fontWeight: 800 }}>
              Movistar <span style={{ fontWeight: 500 }}>Marketplace</span>
            </span>
            <p>
              El marketplace donde encuentras equipos Movistar, servicios
              digitales y productos de miles de sellers. Compra fácil, vende sin
              límites.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="ftr-bottom">
        <div className="md-container">
          <span>
            © {new Date().getFullYear()} Movistar Marketplace. Proyecto demo.
          </span>
          <span>Hecho con Next.js · Material Design 3</span>
        </div>
      </div>
    </footer>
  );
}
