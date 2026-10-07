import { Suspense } from "react";
import CatalogClient from "./CatalogClient";
import {
  getProducts,
  getCategories,
  getBrands,
  getProviders
} from "@/lib/data";

export const metadata = { title: "Catálogo · Integratel Marketplace" };

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="container-page py-20">Cargando…</div>}>
      <CatalogClient
        products={getProducts()}
        categories={getCategories()}
        brands={getBrands()}
        providers={getProviders()}
      />
    </Suspense>
  );
}
