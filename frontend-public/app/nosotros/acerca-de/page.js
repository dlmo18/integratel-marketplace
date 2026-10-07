import Link from "next/link";
import StatCard from "@/components/StatCard";

export const metadata = { title: "Acerca de · Integratel" };

const stats = [
  { label: "Clientes activos", value: "250K+", icon: "👥", accent: "blue" },
  { label: "Sellers registrados", value: "3,800+", icon: "🏪", accent: "green" },
  { label: "Productos publicados", value: "120K+", icon: "📦", accent: "navy" },
  { label: "Ciudades con cobertura", value: "25", icon: "📍", accent: "blue" }
];

const values = [
  {
    icon: "🤝",
    title: "Confianza",
    text: "Compras protegidas, sellers verificados y seguimiento en cada pedido."
  },
  {
    icon: "⚡",
    title: "Agilidad",
    text: "Publicar, comprar y pagar en pocos pasos, sin fricciones."
  },
  {
    icon: "🌎",
    title: "Cercanía",
    text: "Pensado para el Perú, con envíos a todo el país y soporte local."
  },
  {
    icon: "💡",
    title: "Innovación",
    text: "Un asistente con IA que te acompaña a comprar y vender mejor."
  }
];

const team = [
  { name: "María Fernández", role: "CEO & Fundadora", img: "/img/avatars/user-001.jpg" },
  { name: "Carlos Rojas", role: "Director de Tecnología", img: "/img/avatars/seller-001.jpg" },
  { name: "Lucía Mendoza", role: "Líder de Experiencia", img: "/img/avatars/default.jpg" }
];

export default function AcercaDePage() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-movistar-navy text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/banners/hero-ecommerce.jpg"
          alt="Equipo Integratel"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-movistar-navy via-movistar-navy/85 to-transparent" />
        <div className="relative max-w-2xl px-6 py-16 sm:px-10">
          <span className="badge bg-movistar-green text-white">Nuestra historia</span>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Conectamos a todo el Perú con un solo marketplace
          </h1>
          <p className="mt-4 text-white/85">
            Nacimos para que comprar y vender sea simple, seguro y para todos:
            desde equipos y accesorios Movistar hasta productos de miles de
            emprendedores locales.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/catalogo" className="btn-primary">
              Explorar catálogo
            </Link>
            <Link
              href="/soporte/vender"
              className="btn-outline border-white text-white hover:bg-white hover:text-movistar-navy"
            >
              Quiero vender
            </Link>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>

      {/* Misión / Visión con imágenes */}
      <section className="grid gap-6 md:grid-cols-2">
        <article className="card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/banners/hero-compras.jpg"
            alt="Nuestra misión"
            className="h-48 w-full object-cover"
          />
          <div className="p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-movistar-navy">
              <span className="text-2xl">🎯</span> Nuestra misión
            </h2>
            <p className="mt-2 text-movistar-gray-med">
              Democratizar el comercio digital en el Perú, dando a cada persona
              y emprendedor las herramientas para comprar y vender con confianza,
              sin importar su tamaño ni su rubro.
            </p>
          </div>
        </article>

        <article className="card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/banners/hero-ofertas.jpg"
            alt="Nuestra visión"
            className="h-48 w-full object-cover"
          />
          <div className="p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-movistar-navy">
              <span className="text-2xl">🔭</span> Nuestra visión
            </h2>
            <p className="mt-2 text-movistar-gray-med">
              Ser el marketplace de referencia del país: el lugar donde los
              peruanos encuentran lo que buscan y donde cada seller hace crecer
              su negocio con tecnología de primer nivel.
            </p>
          </div>
        </article>
      </section>

      {/* Valores con íconos */}
      <section>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-movistar-navy">
            Nuestros valores
          </h2>
          <p className="mt-1 text-movistar-gray-med">
            Lo que nos guía en cada decisión del marketplace.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="card p-6 text-center transition-transform hover:-translate-y-1"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-movistar-blue/10 text-3xl">
                {v.icon}
              </span>
              <h3 className="mt-4 font-bold text-movistar-navy">{v.title}</h3>
              <p className="mt-2 text-sm text-movistar-gray-med">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo con avatares */}
      <section>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-movistar-navy">
            Nuestro equipo
          </h2>
          <p className="mt-1 text-movistar-gray-med">
            Personas apasionadas por el comercio y la tecnología.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {team.map((m) => (
            <div key={m.name} className="card p-6 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.img}
                alt={m.name}
                className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-movistar-blue/15"
              />
              <h3 className="mt-4 font-bold text-movistar-navy">{m.name}</h3>
              <p className="text-sm text-movistar-blue">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden rounded-3xl bg-movistar-blue text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/banners/seller-cta.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="relative flex flex-col items-center gap-4 px-6 py-12 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            ¿Listo para ser parte de Integratel?
          </h2>
          <p className="max-w-xl text-white/90">
            Compra con confianza o empieza a vender hoy mismo. Miles de personas
            ya forman parte de nuestra comunidad.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/registro"
              className="btn bg-white text-movistar-blue hover:bg-white/90"
            >
              Crear cuenta
            </Link>
            <Link
              href="/soporte/vender"
              className="btn-outline border-white text-white hover:bg-white hover:text-movistar-blue"
            >
              Vender en el marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
