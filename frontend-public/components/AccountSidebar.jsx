"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { getTier } from "@/lib/tiers";

const buyerLinks = [
  { href: "/cuenta", label: "Panel", icon: "home" },
  { href: "/cuenta/compras", label: "Dashboard compras", icon: "insights" },
  { href: "/cuenta/compras/historial", label: "Historial de compras", icon: "receipt_long" },
  { href: "/cuenta/compras/entregas", label: "Estado de entregas", icon: "local_shipping" },
  { href: "/cuenta/compras/devoluciones", label: "Estado de devoluciones", icon: "undo" }
];

const sellerLinks = [
  { href: "/cuenta/ventas", label: "Dashboard ventas", icon: "trending_up" },
  { href: "/cuenta/ventas/historial", label: "Historial de ventas", icon: "list_alt" },
  { href: "/cuenta/ventas/items", label: "Gestión de items", icon: "inventory_2" },
  { href: "/cuenta/ventas/transacciones", label: "Transacciones de pago", icon: "payments" }
];

const activityLinks = [
  { href: "/cuenta/favoritos", label: "Lista de deseos", icon: "favorite" },
  { href: "/cuenta/resenas", label: "Mis reseñas", icon: "rate_review" }
];

const rewardLinks = [
  { href: "/cuenta/puntos", label: "Canje de puntos", icon: "stars" },
  { href: "/cuenta/vouchers", label: "Vouchers", icon: "confirmation_number" }
];

const dataLinks = [
  { href: "/cuenta/datos", label: "Datos personales", icon: "person" },
  { href: "/cuenta/datos/direcciones", label: "Direcciones", icon: "location_on" },
  { href: "/cuenta/datos/pagos", label: "Medios de pago", icon: "credit_card" }
];

function Group({ title, links, pathname }) {
  return (
    <div className="acc-group">
      <p className="title">{title}</p>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={`acc-link md-state ${pathname === l.href ? "active" : ""}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                {l.icon}
              </span>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AccountSidebar() {
  const pathname = usePathname();
  const { user, tier, isSeller, logout } = useStore();
  const info = getTier(tier);

  return (
    <aside className="md-card md-card-elevated acc-sidebar">
      <div className="acc-user">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user?.avatar || "/img/avatars/default.jpg"} alt={user?.name} />
        <div>
          <p className="name">{user?.name}</p>
          <span className={`tier-chip tier-${info.key}`}>
            <span className="material-symbols-outlined filled">{info.icon}</span>
            {info.label}
          </span>
        </div>
      </div>

      <Group title="Mis compras" links={buyerLinks} pathname={pathname} />
      {isSeller && (
        <Group title="Mis ventas" links={sellerLinks} pathname={pathname} />
      )}
      <Group title="Mi actividad" links={activityLinks} pathname={pathname} />
      <Group title="Recompensas" links={rewardLinks} pathname={pathname} />
      <Group title="Mis datos" links={dataLinks} pathname={pathname} />

      <button onClick={logout} className="md-btn md-btn-outlined md-btn-block md-state">
        Cerrar sesión
      </button>
    </aside>
  );
}
