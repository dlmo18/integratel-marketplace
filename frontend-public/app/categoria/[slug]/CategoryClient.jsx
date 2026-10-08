"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

// Landing de categoría con hero, filtros y grilla. El comparador vive en el
// store (casilla en cada tarjeta + barra flotante global).
export default function CategoryClient({ category, products }) {
  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products]);
  const providers = useMemo(() => [...new Set(products.map((p) => p.provider))].sort(), [products]);
  const priceCeiling = useMemo(() => Math.max(100, ...products.map((p) => p.price)), [products]);

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
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "sales") list = [...list].sort((a, b) => b.reviews - a.reviews);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === "discount")
      list = [...list].sort(
        (a, b) =>
          (b.listPrice - b.price) / b.listPrice - (a.listPrice - a.price) / a.listPrice
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
      {/* Hero de categoría */}
      <div className="page-header" style={{ position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.image}
          alt={category.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }}
        />
        <div className="md-container" style={{ position: "relative" }}>
          <nav className="crumbs">
            <Link href="/">Inicio</Link> / <Link href="/catalogo">Catálogo</Link> /{" "}
            <span style={{ color: "#fff" }}>{category.name}</span>
          </nav>
          <h1 style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "2.5rem" }}>{category.icon}</span>
            {category.name}
          </h1>
          <p>{category.description}</p>
        </div>
      </div>

      <div className="md-container md-page" style={{ paddingBottom: 112 }}>
        <div className="md-with-aside">
          <aside className="md-card md-card-elevated md-card-pad-sm md-stack" style={{ height: "fit-content" }}>
            <div className="md-row-between">
              <h2 className="md-title-medium" style={{ margin: 0 }}>Filtros</h2>
              <button onClick={clear} className="md-btn md-btn-text md-btn-sm md-state">Limpiar</button>
            </div>

            <div>
              <label className="md-form-label">Buscar</label>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nombre del producto" className="md-input" />
            </div>
            <div>
              <label className="md-form-label">Marca</label>
              <select value={brand} onChange={(e) => setBrand(e.target.value)} className="md-select">
                <option value="">Todas</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="md-form-label">Proveedor</label>
              <select value={provider} onChange={(e) => setProvider(e.target.value)} className="md-select">
                <option value="">Todos</option>
                {providers.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="md-form-label">Precio máximo: S/ {maxPrice}</label>
              <input type="range" min="100" max={priceCeiling} step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="md-range" />
            </div>
          </aside>

          <div>
            <div className="md-row-between" style={{ marginBottom: 16 }}>
              <span className="md-muted md-body-medium">{filtered.length} productos en {category.name}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="md-select" style={{ width: "auto" }}>
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="sales">Más vendidos</option>
                <option value="rating">Mejor valorados</option>
                <option value="discount">Mayor descuento</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="md-card md-card-outlined md-card-pad md-center md-muted">
                No se encontraron productos con esos filtros.
              </div>
            ) : (
              <div className="prod-grid-3">
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
