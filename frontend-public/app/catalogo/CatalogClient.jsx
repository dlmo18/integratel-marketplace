"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import RecentlyViewed from "@/components/RecentlyViewed";

export default function CatalogClient({
  products,
  categories,
  brands,
  providers
}) {
  const params = useSearchParams();
  const initialCat = params.get("categoria") || "";
  const orden = params.get("orden") || "";
  const initialSearch = params.get("buscar") || "";

  const [category, setCategory] = useState(initialCat);
  const [brand, setBrand] = useState("");
  const [provider, setProvider] = useState("");
  const [maxPrice, setMaxPrice] = useState(4000);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(
    orden === "vendidos" ? "sales" : orden === "ofertas" ? "discount" : "relevance"
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (brand && p.brand !== brand) return false;
      if (provider && p.provider !== provider) return false;
      if (p.price > maxPrice) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q))
          return false;
      }
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "sales") list = [...list].sort((a, b) => b.reviews - a.reviews);
    else if (sort === "discount")
      list = [...list].sort(
        (a, b) =>
          (b.listPrice - b.price) / b.listPrice - (a.listPrice - a.price) / a.listPrice
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
    <div className="md-container md-page" style={{ paddingBottom: 112 }}>
      <h1 className="md-headline-large" style={{ marginBottom: 24 }}>Catálogo</h1>
      <div className="md-with-aside">
        {/* Filtros */}
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
            <label className="md-form-label">Categoría</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="md-select">
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="md-form-label">Marca</label>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="md-select">
              <option value="">Todas</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="md-form-label">Proveedor</label>
            <select value={provider} onChange={(e) => setProvider(e.target.value)} className="md-select">
              <option value="">Todos</option>
              {providers.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="md-form-label">Precio máximo: S/ {maxPrice}</label>
            <input type="range" min="100" max="4000" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="md-range" />
          </div>
        </aside>

        {/* Resultados */}
        <div>
          <div className="md-row-between" style={{ marginBottom: 16 }}>
            <span className="md-muted md-body-medium">{filtered.length} productos encontrados</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="md-select" style={{ width: "auto" }}>
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="sales">Más vendidos</option>
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

      {/* Vistos recientemente */}
      <RecentlyViewed />
    </div>
  );
}
