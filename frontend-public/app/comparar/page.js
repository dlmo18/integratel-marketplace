"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getProductById, getCategoryBySlug } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

const discountOf = (p) =>
  p.listPrice > p.price ? Math.round((1 - p.price / p.listPrice) * 100) : 0;

const categoryName = (slug) => getCategoryBySlug(slug)?.name || slug;

export default function ComparePage() {
  const { compare, toggleCompare, clearCompare, addToCart } = useStore();

  const products = compare.map((id) => getProductById(id)).filter(Boolean);

  if (products.length === 0) {
    return (
      <div className="md-container md-page md-center" style={{ paddingBlock: 64 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--md-on-surface-variant)" }}>balance</span>
        <h1 className="md-headline-small" style={{ marginTop: 16 }}>No hay productos para comparar</h1>
        <p className="md-muted" style={{ marginTop: 8 }}>
          Marca la casilla “Comparar” en las tarjetas de producto para añadir hasta 4 artículos.
        </p>
        <Link href="/catalogo" className="md-btn md-btn-filled md-state" style={{ marginTop: 24 }}>Ir al catálogo</Link>
      </div>
    );
  }

  const minPrice = Math.min(...products.map((p) => p.price));
  const maxDiscount = Math.max(...products.map((p) => discountOf(p)));
  const maxRating = Math.max(...products.map((p) => p.rating));

  const rows = [
    {
      label: "Precio",
      render: (p) => (
        <span style={{ fontWeight: 700, color: p.price === minPrice ? "var(--md-secondary)" : "var(--md-on-surface)" }}>
          {formatCurrency(p.price, p.currency)}
          {p.price === minPrice && <span style={{ display: "block", fontSize: "0.65rem", textTransform: "uppercase" }}>mejor precio</span>}
        </span>
      )
    },
    { label: "Precio de lista", render: (p) => (p.listPrice > p.price ? <span className="md-muted md-strike">{formatCurrency(p.listPrice, p.currency)}</span> : "—") },
    {
      label: "Descuento",
      render: (p) => {
        const d = discountOf(p);
        if (d === 0) return "—";
        return <span style={{ fontWeight: d === maxDiscount ? 700 : 400, color: d === maxDiscount ? "var(--md-secondary)" : "inherit" }}>-{d}%</span>;
      }
    },
    { label: "Marca", render: (p) => p.brand },
    { label: "Proveedor", render: (p) => p.provider },
    { label: "Categoría", render: (p) => categoryName(p.category) },
    {
      label: "Stock",
      render: (p) =>
        p.stock > 0 ? (
          <span style={{ color: p.stock <= 5 ? "var(--md-error)" : "var(--md-secondary)" }}>
            {p.stock <= 5 ? `¡Últimas ${p.stock}!` : `${p.stock} disponibles`}
          </span>
        ) : (
          <span className="md-muted">Agotado</span>
        )
    },
    {
      label: "Valoración",
      render: (p) => (
        <span style={{ fontWeight: p.rating === maxRating ? 700 : 400, color: p.rating === maxRating ? "var(--md-secondary)" : "inherit" }}>
          ★ {p.rating} <span className="md-muted" style={{ fontSize: "0.75rem" }}>({p.reviews})</span>
        </span>
      )
    }
  ];

  const specLabels = [];
  products.forEach((p) => (p.specs || []).forEach((s) => {
    if (!specLabels.includes(s.label)) specLabels.push(s.label);
  }));
  const valueOfSpec = (p, label) => {
    const found = (p.specs || []).find((s) => s.label === label);
    return found ? found.value : "—";
  };

  return (
    <div className="md-container md-page">
      <nav className="md-crumbs">
        <Link href="/">Inicio</Link> / <span style={{ color: "var(--md-on-surface)" }}>Comparar productos</span>
      </nav>

      <div className="md-row-between md-wrap" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="md-headline-large">Comparar productos</h1>
          <p className="md-muted md-body-medium">{products.length} de 4 productos · especificaciones lado a lado</p>
        </div>
        <button onClick={clearCompare} className="md-btn md-btn-text md-btn-sm md-state">Vaciar comparación</button>
      </div>

      <div className="md-card md-card-elevated md-table-wrap">
        <table className="md-table" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ background: "var(--md-surface)" }} />
              {products.map((p) => (
                <th key={p.id} style={{ minWidth: 200, textAlign: "center", verticalAlign: "top", background: "var(--md-surface)" }}>
                  <div className="md-col md-center" style={{ alignItems: "center", gap: 8 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images?.[0]} alt={p.name} style={{ height: 96, width: 96, borderRadius: "var(--md-shape-md)", objectFit: "cover" }} />
                    <Link href={`/producto/${p.slug}`} className="md-title-small" style={{ color: "var(--md-on-surface)" }}>{p.name}</Link>
                    <button onClick={() => toggleCompare(p)} className="md-btn md-btn-text md-btn-sm" style={{ color: "var(--md-error)" }}>Quitar</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={products.length + 1} style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem", background: "color-mix(in srgb, var(--md-primary) 6%, transparent)" }}>Información general</td></tr>
            {rows.map((row) => (
              <tr key={row.label}>
                <td style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "0.72rem", color: "var(--md-on-surface-variant)", background: "var(--md-surface-container)", whiteSpace: "nowrap" }}>{row.label}</td>
                {products.map((p) => <td key={p.id} style={{ textAlign: "center", verticalAlign: "top" }}>{row.render(p)}</td>)}
              </tr>
            ))}
            {specLabels.length > 0 && (
              <>
                <tr><td colSpan={products.length + 1} style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem", background: "color-mix(in srgb, var(--md-primary) 6%, transparent)" }}>Especificaciones técnicas</td></tr>
                {specLabels.map((label) => (
                  <tr key={`spec-${label}`}>
                    <td style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "0.72rem", color: "var(--md-on-surface-variant)", background: "var(--md-surface-container)", whiteSpace: "nowrap" }}>{label}</td>
                    {products.map((p) => <td key={p.id} style={{ textAlign: "center", verticalAlign: "top", fontSize: "0.8rem", color: "var(--md-on-surface-variant)" }}>{valueOfSpec(p, label)}</td>)}
                  </tr>
                ))}
              </>
            )}
            <tr>
              <td style={{ background: "var(--md-surface-container)" }} />
              {products.map((p) => (
                <td key={p.id} style={{ textAlign: "center" }}>
                  <button
                    onClick={() => addToCart(p, 1)}
                    disabled={p.stock <= 0}
                    className={`md-btn md-btn-sm md-state ${p.stock <= 0 ? "md-btn-outlined" : "md-btn-filled"}`}
                    style={{ width: "100%" }}
                  >
                    {p.stock <= 0 ? "Agotado" : "Agregar"}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 24 }}>
        <Link href="/catalogo" className="md-btn md-btn-outlined md-state">← Seguir explorando</Link>
      </div>
    </div>
  );
}
