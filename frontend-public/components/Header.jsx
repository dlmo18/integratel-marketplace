"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import CartPreview from "@/components/CartPreview";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { getCategories } from "@/lib/data";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo", hasMenu: true },
  { href: "/giftcards", label: "Giftcards" },
  { href: "/comparar", label: "Comparar" },
  { href: "/nosotros/acerca-de", label: "Nosotros" },
  { href: "/soporte/contactanos", label: "Soporte" },
  { href: "/soporte/vender", label: "Vender" }
];

const categories = getCategories();

export default function Header() {
  const { user, logout, favoritesCount } = useStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-movistar-navy text-white shadow">
      {/* Barra superior informativa */}
      <div className="bg-movistar-blue/90 text-xs">
        <div className="container-page flex h-8 items-center justify-between">
          <span>Envíos a todo el Perú · Compra 100% segura</span>
          <div className="hidden gap-4 sm:flex">
            <Link href="/soporte/seguimiento" className="hover:underline">
              Seguir pedido
            </Link>
            <Link
              href="/soporte/cambios-devoluciones"
              className="hover:underline"
            >
              Cambios y devoluciones
            </Link>
          </div>
        </div>
      </div>

      {/* Nivel 1: logo + buscador + acciones */}
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-2xl font-black tracking-tight">
            integra<span className="text-movistar-blue">tel</span>
          </span>
          <span className="hidden rounded bg-movistar-green px-2 py-0.5 text-[10px] font-bold uppercase sm:inline">
            Marketplace
          </span>
        </Link>

        {/* Buscador con autocompletado (ocupa el centro) */}
        <div className="hidden flex-1 md:block">
          <SearchAutocomplete />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Favoritos */}
          <Link
            href="/cuenta/favoritos"
            className="relative rounded-full bg-white p-2 text-movistar-navy hover:bg-white/70"
            aria-label="Lista de deseos"
            title="Lista de deseos"
          >
            <span className="text-xl">❤️</span>
            {favoritesCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-movistar-green text-[10px] font-bold text-white">
                {favoritesCount}
              </span>
            )}
          </Link>

          <CartPreview />

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/cuenta"
                className="btn-outline border-white text-white hover:bg-white hover:text-movistar-navy"
              >
                Mi cuenta
              </Link>
              <button onClick={logout} className="text-sm hover:underline">
                Salir
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden btn-primary sm:inline-flex">
              Ingresar
            </Link>
          )}

          <button
            className="rounded p-2 hover:bg-white/10 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Buscador en móvil (debajo del nivel 1) */}
      <div className="container-page pb-3 md:hidden">
        <SearchAutocomplete />
      </div>

      {/* Nivel 2: menú de navegación */}
      <div className="hidden border-t border-white/10 bg-movistar-navy md:block">
        <div className="container-page">
          <nav className="flex items-center gap-6 py-2.5">
            {nav.map((item) =>
              item.hasMenu ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-movistar-blue ${
                      pathname === item.href ||
                      pathname.startsWith("/categoria")
                        ? "text-movistar-blue"
                        : "text-white"
                    }`}
                  >
                    {item.label}
                    <span className="text-[10px] transition-transform group-hover:rotate-180">
                      ▼
                    </span>
                  </Link>

                  {/* Mega-menú de categorías */}
                  <div className="invisible absolute left-0 top-full z-50 w-72 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="overflow-hidden rounded-2xl bg-white text-movistar-navy shadow-2xl ring-1 ring-black/5">
                      <Link
                        href="/catalogo"
                        className="block border-b bg-movistar-gray px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-movistar-gray-med hover:text-movistar-blue"
                      >
                        Ver todo el catálogo →
                      </Link>
                      <ul className="grid grid-cols-1 py-1">
                        {categories.map((c) => (
                          <li key={c.id}>
                            <Link
                              href={`/categoria/${c.slug}`}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-movistar-gray hover:text-movistar-blue"
                            >
                              <span className="text-lg">{c.icon}</span>
                              <span className="flex-1 font-medium">
                                {c.name}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-movistar-blue ${
                    pathname === item.href
                      ? "text-movistar-blue"
                      : "text-white"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="border-t border-white/10 bg-movistar-navy md:hidden">
          <div className="container-page flex flex-col py-3">
            {nav.map((item) =>
              item.hasMenu ? (
                <div key={item.href}>
                  <button
                    onClick={() => setCatOpen((v) => !v)}
                    className="flex w-full items-center justify-between py-2 text-sm"
                    aria-expanded={catOpen}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`text-[10px] transition-transform ${
                        catOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  {catOpen && (
                    <div className="mb-1 ml-2 flex flex-col border-l border-white/15 pl-3">
                      <Link
                        href="/catalogo"
                        className="py-1.5 text-xs font-semibold uppercase tracking-wide text-white/70"
                        onClick={() => {
                          setOpen(false);
                          setCatOpen(false);
                        }}
                      >
                        Ver todo el catálogo
                      </Link>
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          href={`/categoria/${c.slug}`}
                          className="flex items-center gap-2 py-1.5 text-sm"
                          onClick={() => {
                            setOpen(false);
                            setCatOpen(false);
                          }}
                        >
                          <span>{c.icon}</span>
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2 text-sm"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/cuenta/favoritos"
              className="py-2 text-sm"
              onClick={() => setOpen(false)}
            >
              ❤️ Lista de deseos
              {favoritesCount > 0 ? ` (${favoritesCount})` : ""}
            </Link>
            {user ? (
              <Link
                href="/cuenta"
                className="py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                Mi cuenta
              </Link>
            ) : (
              <Link
                href="/login"
                className="py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                Ingresar / Registrarme
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
