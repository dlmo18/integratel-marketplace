"use client";

import Link from "next/link";
import Image from "next/image";
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

  const isActive = (item) =>
    item.href === pathname ||
    (item.hasMenu && pathname.startsWith("/categoria"));

  return (
    <header className="hdr">
      {/* Barra informativa superior */}
      <div className="hdr-info">
        <div className="md-container">
          <span>Envíos a todo el Perú · Compra 100% segura</span>
          <div className="hdr-info-links">
            <Link href="/soporte/seguimiento">Seguir pedido</Link>
            <Link href="/soporte/cambios-devoluciones">
              Cambios y devoluciones
            </Link>
          </div>
        </div>
      </div>

      {/* Nivel 1: logo + buscador + acciones */}
      <div className="md-container">
        <div className="hdr-main">
          <Link href="/" className="hdr-logo" aria-label="Movistar Marketplace">
            <Image src="/img/logo.svg" width={120} height={34} alt="Movistar" priority />
            <span className="tag">Marketplace</span>
          </Link>

          <div className="hdr-search">
            <SearchAutocomplete />
          </div>

          <div className="hdr-actions">
            <Link
              href="/cuenta/favoritos"
              className="hdr-icon-btn md-state"
              aria-label="Lista de deseos"
              title="Lista de deseos"
            >
              <span className="material-symbols-outlined">favorite</span>
              {favoritesCount > 0 && (
                <span className="md-count">{favoritesCount}</span>
              )}
            </Link>

            <CartPreview />

            {user ? (
              <div className="hdr-account">
                <Link
                  href="/cuenta"
                  className="md-btn md-btn-outlined-on-dark md-btn-sm md-state"
                >
                  Mi cuenta
                </Link>
                <button
                  onClick={logout}
                  className="md-btn md-btn-text md-btn-sm md-state"
                  style={{ color: "var(--md-on-primary)" }}
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="md-btn md-btn-on-dark md-btn-sm md-state hdr-account"
              >
                Ingresar
              </Link>
            )}

            <button
              className="hdr-icon-btn md-state hdr-menu-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined">
                {open ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Buscador en móvil */}
        <div className="hdr-search-mobile">
          <SearchAutocomplete />
        </div>
      </div>

      {/* Nivel 2: navegación (desktop) */}
      <nav className="hdr-nav">
        <div className="md-container">
          {nav.map((item) =>
            item.hasMenu ? (
              <div key={item.href} className="hdr-megamenu">
                <Link
                  href={item.href}
                  className={`md-state ${isActive(item) ? "active" : ""}`}
                >
                  {item.label}
                  <span className="material-symbols-outlined" aria-hidden>
                    expand_more
                  </span>
                </Link>
                <div className="panel">
                  <div className="panel-inner">
                    <Link href="/catalogo" className="panel-head">
                      Ver todo el catálogo →
                    </Link>
                    {categories.map((c) => (
                      <Link key={c.id} href={`/categoria/${c.slug}`}>
                        <span style={{ fontSize: "1.1rem" }}>{c.icon}</span>
                        <span>{c.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`md-state ${isActive(item) ? "active" : ""}`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </nav>

      {/* Menú móvil */}
      {open && (
        <div className="hdr-mobile">
          <div className="md-container">
            {nav.map((item) =>
              item.hasMenu ? (
                <div key={item.href}>
                  <button
                    onClick={() => setCatOpen((v) => !v)}
                    aria-expanded={catOpen}
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span>{item.label}</span>
                    <span className="material-symbols-outlined">
                      {catOpen ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                  {catOpen && (
                    <div style={{ paddingLeft: 12 }}>
                      <Link
                        href="/catalogo"
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
                          onClick={() => {
                            setOpen(false);
                            setCatOpen(false);
                          }}
                        >
                          {c.icon} {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <Link href="/cuenta/favoritos" onClick={() => setOpen(false)}>
              ❤️ Lista de deseos
              {favoritesCount > 0 ? ` (${favoritesCount})` : ""}
            </Link>
            {user ? (
              <Link href="/cuenta" onClick={() => setOpen(false)}>
                Mi cuenta
              </Link>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                Ingresar / Registrarme
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
