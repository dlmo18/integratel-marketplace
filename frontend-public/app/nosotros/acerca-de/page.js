import Link from "next/link";
import StatCard from "@/components/StatCard";

export const metadata = { title: "Acerca de · Movistar" };

const stats = [
  { label: "Clientes activos", value: "250K+", icon: "👥", accent: "primary" },
  { label: "Sellers registrados", value: "3,800+", icon: "🏪", accent: "secondary" },
  { label: "Productos publicados", value: "120K+", icon: "📦", accent: "primary" },
  { label: "Ciudades con cobertura", value: "25", icon: "📍", accent: "tertiary" }
];

const values = [
  { icon: "🤝", title: "Confianza", text: "Compras protegidas, sellers verificados y seguimiento en cada pedido." },
  { icon: "⚡", title: "Agilidad", text: "Publicar, comprar y pagar en pocos pasos, sin fricciones." },
  { icon: "🌎", title: "Cercanía", text: "Pensado para el Perú, con envíos a todo el país y soporte local." },
  { icon: "💡", title: "Innovación", text: "Un asistente con IA que te acompaña a comprar y vender mejor." }
];

const team = [
  { name: "María Fernández", role: "CEO & Fundadora", img: "/img/avatars/user-001.jpg" },
  { name: "Carlos Rojas", role: "Director de Tecnología", img: "/img/avatars/seller-001.jpg" },
  { name: "Lucía Mendoza", role: "Líder de Experiencia", img: "/img/avatars/default.jpg" }
];

export default function AcercaDePage() {
  return (
    <div className="md-stack" style={{ gap: 56 }}>
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", borderRadius: "var(--md-shape-xl)", background: "linear-gradient(135deg, var(--md-hero-from), var(--md-hero-to))", color: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/banners/hero-ecommerce.jpg" alt="Equipo Movistar" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />
        <div style={{ position: "relative", maxWidth: 640, padding: "64px 40px" }}>
          <span className="md-badge md-badge-secondary">Nuestra historia</span>
          <h1 className="md-display-small" style={{ marginTop: 12, fontWeight: 800 }}>
            Conectamos a todo el Perú con un solo marketplace
          </h1>
          <p style={{ marginTop: 16, color: "rgba(255,255,255,0.85)" }}>
            Nacimos para que comprar y vender sea simple, seguro y para todos:
            desde equipos y accesorios Movistar hasta productos de miles de
            emprendedores locales.
          </p>
          <div className="md-row md-wrap" style={{ gap: 12, marginTop: 24 }}>
            <Link href="/catalogo" className="md-btn md-btn-on-dark md-state">Explorar catálogo</Link>
            <Link href="/soporte/vender" className="md-btn md-btn-outlined-on-dark md-state">Quiero vender</Link>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </section>

      {/* Misión / Visión */}
      <section style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <article className="md-card md-card-elevated">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/banners/hero-compras.jpg" alt="Nuestra misión" style={{ height: 192, width: "100%", objectFit: "cover" }} />
          <div className="md-card-pad">
            <h2 className="md-title-large" style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: "1.5rem" }}>🎯</span> Nuestra misión</h2>
            <p className="md-muted" style={{ marginTop: 8 }}>
              Democratizar el comercio digital en el Perú, dando a cada persona y
              emprendedor las herramientas para comprar y vender con confianza.
            </p>
          </div>
        </article>
        <article className="md-card md-card-elevated">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/banners/hero-ofertas.jpg" alt="Nuestra visión" style={{ height: 192, width: "100%", objectFit: "cover" }} />
          <div className="md-card-pad">
            <h2 className="md-title-large" style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: "1.5rem" }}>🔭</span> Nuestra visión</h2>
            <p className="md-muted" style={{ marginTop: 8 }}>
              Ser el marketplace de referencia del país: donde los peruanos
              encuentran lo que buscan y cada seller hace crecer su negocio.
            </p>
          </div>
        </article>
      </section>

      {/* Valores */}
      <section>
        <div className="md-center" style={{ marginBottom: 24 }}>
          <h2 className="md-headline-small">Nuestros valores</h2>
          <p className="md-muted" style={{ marginTop: 4 }}>Lo que nos guía en cada decisión del marketplace.</p>
        </div>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {values.map((v) => (
            <div key={v.title} className="md-card md-card-elevated md-card-pad md-center">
              <span style={{ margin: "0 auto", display: "flex", height: 56, width: 56, alignItems: "center", justifyContent: "center", borderRadius: "var(--md-shape-lg)", fontSize: "1.8rem", background: "color-mix(in srgb, var(--md-primary) 12%, transparent)" }}>{v.icon}</span>
              <h3 className="md-title-medium" style={{ marginTop: 16 }}>{v.title}</h3>
              <p className="md-muted md-body-medium" style={{ marginTop: 8 }}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo */}
      <section>
        <div className="md-center" style={{ marginBottom: 24 }}>
          <h2 className="md-headline-small">Nuestro equipo</h2>
          <p className="md-muted" style={{ marginTop: 4 }}>Personas apasionadas por el comercio y la tecnología.</p>
        </div>
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {team.map((m) => (
            <div key={m.name} className="md-card md-card-elevated md-card-pad md-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.img} alt={m.name} style={{ margin: "0 auto", height: 96, width: 96, borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 0 4px color-mix(in srgb, var(--md-primary) 15%, transparent)" }} />
              <h3 className="md-title-medium" style={{ marginTop: 16 }}>{m.name}</h3>
              <p className="md-primary-text md-body-medium">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section style={{ position: "relative", overflow: "hidden", borderRadius: "var(--md-shape-xl)", background: "var(--md-primary)", color: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/banners/seller-cta.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} />
        <div className="md-center" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "48px 24px" }}>
          <h2 className="md-headline-small">¿Listo para ser parte de Movistar Marketplace?</h2>
          <p style={{ maxWidth: 560, color: "rgba(255,255,255,0.9)" }}>
            Compra con confianza o empieza a vender hoy mismo. Miles de personas ya forman parte de nuestra comunidad.
          </p>
          <div className="md-row md-wrap" style={{ justifyContent: "center", gap: 12 }}>
            <Link href="/registro" className="md-btn md-btn-on-dark md-state">Crear cuenta</Link>
            <Link href="/soporte/vender" className="md-btn md-btn-outlined-on-dark md-state">Vender en el marketplace</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
