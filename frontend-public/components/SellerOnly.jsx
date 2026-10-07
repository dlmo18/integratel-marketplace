"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function SellerOnly({ children }) {
  const { isSeller } = useStore();
  if (!isSeller) {
    return (
      <div className="card p-10 text-center">
        <span className="text-4xl">🔒</span>
        <h2 className="mt-3 text-lg font-bold text-movistar-navy">
          Sección exclusiva para Sellers
        </h2>
        <p className="mt-1 text-sm text-movistar-gray-med">
          Debes tener una cuenta de tipo Seller para acceder a esta sección.
        </p>
        <Link href="/registro?tipo=seller" className="btn-green mt-4">
          Darse de alta como Seller
        </Link>
      </div>
    );
  }
  return children;
}
