"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

// Landing de categoría: muestra el hero de la categoría, todos sus productos
// y una sección de filtros (búsqueda, marca, proveedor, precio y orden)
// acotada a los productos de esa categoría. El comparador vive en el store
// (casilla en cada tarjeta + barra flotante global).
export default function CategoryClient({ category, products }) {
  // Opciones de filtro derivadas de los productos de ESTA categoría.
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products]
  );
  const providers = useMemo(
    () => [...new Set(products.map((p) => p.provider))].sort(),
    [products]
  );
  const priceCeiling = useMemo(
    () => Math.max(100, ...products.map((p) => p.price)),
    [products]
  );

  const [brand, setBrand] = useState("");
  const [provider, setProvider] = useState("");
  const [maxPrice, setMaxPrice] = useState(priceCeiling);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (provider && p.provider !== provider) return false;
      if (p.price > maxPrice) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "sales")
      list = [...list].sort((a, b) => b.reviews - a.reviews);
    else if (sort === "rating")
      list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === "discount")
      list = [...list].sort(
        (a, b) =>
          (b.listPrice - b.price) / b.listPrice -
          (a.listPrice - a.price) / a.listPrice
      );

    return list;
  }, [products, brand, provider, maxPrice, search, sort]);

  const clear = () => {
    setBrand("");
    setProvider("");
    setMaxPrice(priceCeiling);
    setSearch("");
    setSort("relevance");
  };

  return (
    <div>
      {/* Hero de la categoría */}
      <div className="relative overflow-hidden bg-movistar-navy text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-movistar-navy via-movistar-navy/80 to-transparent" />
        <div className="container-page relative py-14">
          <nav className="mb-3 text-sm text-white/70">
            <Link href="/" className="hover:underline">
              Inicio
            </Link>{" "}
            /{" "}
            <Link href="/catalogo" className="hover:underline">
              Catálogo
            </Link>{" "}
            / <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="flex items-center gap-3 text-4xl font-bold">
            <span className="text-5xl">{category.icon}</span>
            {category.name}
          </h1>
          <p className="mt-2 max-w-xl text-white/85">{category.description}</p>
        </div>
      </div>

      <div className="container-page py-8 pb-28">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Filtros */}
          <aside className="card h-fit space-y-5 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-movistar-navy">Filtros</h2>
              <button
                onClick={clear}
                className="text-xs text-movistar-blue hover:underline"
              >
                Limpiar
              </button>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-movistar-gray-med">
                Buscar
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre del producto"
                className="input"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-movistar-gray-med">
                Marca
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="input"
              >
                <option value="">Todas</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-movistar-gray-med">
                Proveedor
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="input"
              >
                <option value="">Todos</option>
                {providers.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-movistar-gray-med">
                Precio máximo: S/ {maxPrice}
              </label>
              <input
                type="range"
                min="100"
                max={priceCeiling}
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-movistar-blue"
              />
            </div>
          </aside>

          {/* Resultados */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-movistar-gray-med">
                {filtered.length} productos en {category.name}
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input w-auto"
              >
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="sales">Más vendidos</option>
                <option value="rating">Mejor valorados</option>
                <option value="discount">Mayor descuento</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="card p-10 text-center text-movistar-gray-med">
                No se encontraron productos con esos filtros.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
