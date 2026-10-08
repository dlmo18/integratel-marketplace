"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function SellerOnly({ children }) {
  const { isSeller } = useStore();
  if (!isSeller) {
    return (
      <div className="md-card md-card-elevated md-card-pad md-center">
        <span className="material-symbols-outlined" style={{ fontSize: 40, color: "var(--md-on-surface-variant)" }}>
          lock
        </span>
        <h2 className="md-title-large" style={{ marginTop: 8 }}>
          Sección exclusiva para Sellers
        </h2>
        <p className="md-muted" style={{ marginTop: 4 }}>
          Debes tener una cuenta de tipo Seller para acceder a esta sección.
        </p>
        <Link href="/registro?tipo=seller" className="md-btn md-btn-green md-state" style={{ marginTop: 16 }}>
          Darse de alta como Seller
        </Link>
      </div>
    );
  }
  return children;
}
