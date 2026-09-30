"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/giftcards", label: "Giftcards" },
  { href: "/nosotros/acerca-de", label: "Nosotros" },
  { href: "/soporte/contactanos", label: "Soporte" },
  { href: "/soporte/vender", label: "Vender" }
];

export default function Header() {
  const { cartCount, user, logout } = useStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-movistar-navy text-white shadow">
      <div className="bg-movistar-blue/90 text-xs">
        <div className="container-page flex h-8 items-center justify-between">
          <span>Envíos a todo el Perú · Compra 100% segura</span>
          <div className="hidden gap-4 sm:flex">
            <Link href="/soporte/seguimiento" className="hover:underline">
              Seguir pedido
            </Link>
            <Link href="/soporte/cambios-devoluciones" className="hover:underline">
              Cambios y devoluciones
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight">
            integra<span className="text-movistar-blue">tel</span>
          </span>
          <span className="hidden rounded bg-movistar-green px-2 py-0.5 text-[10px] font-bold uppercase sm:inline">
            Marketplace
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-movistar-blue ${
                pathname === item.href ? "text-movistar-blue" : "text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/checkout/carrito"
            className="relative rounded-full p-2 bg-white hover:bg-white/50"
            aria-label="Carrito de compras"
          >
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-movistar-green text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/cuenta" className="btn-outline border-white text-white hover:bg-white hover:text-movistar-navy">
                Mi cuenta
              </Link>
              <button onClick={logout} className="text-sm hover:underline">
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden btn-primary sm:inline-flex"
            >
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

      {open && (
        <div className="border-t border-white/10 bg-movistar-navy md:hidden">
          <div className="container-page flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Link href="/cuenta" className="py-2 text-sm" onClick={() => setOpen(false)}>
                Mi cuenta
              </Link>
            ) : (
              <Link href="/login" className="py-2 text-sm" onClick={() => setOpen(false)}>
                Ingresar / Registrarme
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
