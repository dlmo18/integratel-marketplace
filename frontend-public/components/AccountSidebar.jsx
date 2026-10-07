"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";

const buyerLinks = [
  { href: "/cuenta", label: "Panel", icon: "🏠" },
  { href: "/cuenta/compras", label: "Dashboard compras", icon: "📊" },
  { href: "/cuenta/compras/historial", label: "Historial de compras", icon: "🧾" },
  { href: "/cuenta/compras/entregas", label: "Estado de entregas", icon: "🚚" },
  { href: "/cuenta/compras/devoluciones", label: "Estado de devoluciones", icon: "↩️" }
];

const sellerLinks = [
  { href: "/cuenta/ventas", label: "Dashboard ventas", icon: "📈" },
  { href: "/cuenta/ventas/historial", label: "Historial de ventas", icon: "📋" },
  { href: "/cuenta/ventas/items", label: "Gestión de items", icon: "📦" },
  { href: "/cuenta/ventas/transacciones", label: "Transacciones de pago", icon: "💵" }
];

const activityLinks = [
  { href: "/cuenta/favoritos", label: "Lista de deseos", icon: "❤️" },
  { href: "/cuenta/resenas", label: "Mis reseñas", icon: "📝" }
];

const rewardLinks = [
  { href: "/cuenta/puntos", label: "Canje de puntos", icon: "⭐" },
  { href: "/cuenta/vouchers", label: "Vouchers", icon: "🎟️" }
];

const dataLinks = [
  { href: "/cuenta/datos", label: "Datos personales", icon: "👤" },
  { href: "/cuenta/datos/direcciones", label: "Direcciones", icon: "📍" },
  { href: "/cuenta/datos/pagos", label: "Medios de pago", icon: "💳" }
];

function Group({ title, links, pathname }) {
  return (
    <div className="mb-5">
      <p className="mb-2 px-3 text-xs font-bold uppercase text-movistar-gray-med">
        {title}
      </p>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                pathname === l.href
                  ? "bg-movistar-blue text-white"
                  : "text-movistar-navy hover:bg-movistar-blue/10"
              }`}
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const tierLabel = {
  regular: "Cuenta Regular",
  vip: "Cuenta VIP",
  seller: "Cuenta Seller"
};

const tierBadge = {
  regular: "bg-movistar-blue/10 text-movistar-blue",
  vip: "bg-black text-white",
  seller: "bg-movistar-navy text-white"
};

export default function AccountSidebar() {
  const pathname = usePathname();
  const { user, tier, isSeller, isVip, logout } = useStore();

  return (
    <aside className="card h-fit p-4">
      <div className="mb-4 flex items-center gap-3 border-b pb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user?.avatar || "/img/avatars/default.jpg"}
          alt={user?.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-bold text-movistar-navy">{user?.name}</p>
          <span className={`badge mt-1 ${tierBadge[tier] || tierBadge.regular}`}>
            {isVip && "★ "}
            {tierLabel[tier] || tierLabel.regular}
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

      <button onClick={logout} className="btn-outline w-full">
        Cerrar sesión
      </button>
    </aside>
  );
}
