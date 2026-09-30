"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default function CatalogClient({
  products,
  categories,
  brands,
  providers
}) {
  const params = useSearchParams();
  const initialCat = params.get("categoria") || "";
  const orden = params.get("orden") || "";

  const [category, setCategory] = useState(initialCat);
  const [brand, setBrand] = useState("");
  const [provider, setProvider] = useState("");
  const [maxPrice, setMaxPrice] = useState(4000);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(
    orden === "vendidos" ? "sales" : orden === "ofertas" ? "discount" : "relevance"
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
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
    else if (sort === "discount")
      list = [...list].sort(
        (a, b) =>
          (b.listPrice - b.price) / b.listPrice -
          (a.listPrice - a.price) / a.listPrice
      );

    return list;
  }, [products, category, brand, provider, maxPrice, search, sort]);

  const clear = () => {
    setCategory("");
    setBrand("");
    setProvider("");
    setMaxPrice(4000);
    setSearch("");
    setSort("relevance");
  };

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-bold text-movistar-navy">Catálogo</h1>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filtros */}
        <aside className="card h-fit space-y-5 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-movistar-navy">Filtros</h2>
            <button onClick={clear} className="text-xs text-movistar-blue hover:underline">
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
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
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
              max="4000"
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
              {filtered.length} productos encontrados
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
  );
}
