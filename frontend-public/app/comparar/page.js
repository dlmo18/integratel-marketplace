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
      <div className="container-page py-16 text-center">
        <p className="text-5xl">⚖️</p>
        <h1 className="mt-4 text-2xl font-bold text-movistar-navy">
          No hay productos para comparar
        </h1>
        <p className="mt-2 text-movistar-gray-med">
          Marca la casilla “Comparar” en las tarjetas de producto para añadir
          hasta 4 artículos y verlos lado a lado.
        </p>
        <Link href="/catalogo" className="btn-primary mt-6 inline-flex">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  // Resaltados: mejor precio, mayor descuento, mejor valoración.
  const minPrice = Math.min(...products.map((p) => p.price));
  const maxDiscount = Math.max(...products.map((p) => discountOf(p)));
  const maxRating = Math.max(...products.map((p) => p.rating));

  // Filas de la tabla de atributos generales.
  const rows = [
    {
      label: "Precio",
      render: (p) => (
        <span
          className={
            p.price === minPrice
              ? "font-bold text-movistar-green"
              : "font-semibold text-movistar-navy"
          }
        >
          {formatCurrency(p.price, p.currency)}
          {p.price === minPrice && (
            <span className="ml-1 block text-[10px] uppercase">
              mejor precio
            </span>
          )}
        </span>
      )
    },
    {
      label: "Precio de lista",
      render: (p) =>
        p.listPrice > p.price ? (
          <span className="text-movistar-gray-med line-through">
            {formatCurrency(p.listPrice, p.currency)}
          </span>
        ) : (
          "—"
        )
    },
    {
      label: "Descuento",
      render: (p) => {
        const d = discountOf(p);
        if (d === 0) return "—";
        return (
          <span
            className={
              d === maxDiscount && d > 0
                ? "font-bold text-movistar-green"
                : "text-movistar-navy"
            }
          >
            -{d}%
          </span>
        );
      }
    },
    { label: "Marca", render: (p) => p.brand },
    { label: "Proveedor", render: (p) => p.provider },
    { label: "Categoría", render: (p) => categoryName(p.category) },
    {
      label: "Stock",
      render: (p) =>
        p.stock > 0 ? (
          <span className={p.stock <= 5 ? "text-red-500" : "text-movistar-green"}>
            {p.stock <= 5 ? `¡Últimas ${p.stock}!` : `${p.stock} disponibles`}
          </span>
        ) : (
          <span className="text-movistar-gray-med">Agotado</span>
        )
    },
    {
      label: "Valoración",
      render: (p) => (
        <span
          className={
            p.rating === maxRating ? "font-bold text-movistar-green" : ""
          }
        >
          ★ {p.rating}{" "}
          <span className="text-xs text-movistar-gray-med">({p.reviews})</span>
        </span>
      )
    }
  ];

  // Especificaciones técnicas: unión de todas las labels presentes.
  const specLabels = [];
  products.forEach((p) => {
    (p.specs || []).forEach((s) => {
      if (!specLabels.includes(s.label)) specLabels.push(s.label);
    });
  });
  const valueOfSpec = (p, label) => {
    const found = (p.specs || []).find((s) => s.label === label);
    return found ? found.value : "—";
  };

  return (
    <div className="container-page py-8">
      <nav className="mb-4 text-sm text-movistar-gray-med">
        <Link href="/" className="hover:underline">
          Inicio
        </Link>{" "}
        / <span className="text-movistar-navy">Comparar productos</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-movistar-navy">
            Comparar productos
          </h1>
          <p className="text-sm text-movistar-gray-med">
            {products.length} de 4 productos · especificaciones lado a lado
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="text-sm text-movistar-gray-med hover:underline"
        >
          Vaciar comparación
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white" />
              {products.map((p) => (
                <th key={p.id} className="min-w-[200px] p-4 align-top">
                  <div className="flex flex-col items-center gap-2 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="h-28 w-28 rounded-xl object-cover"
                    />
                    <Link
                      href={`/producto/${p.slug}`}
                      className="line-clamp-2 text-xs font-semibold text-movistar-navy hover:text-movistar-blue"
                    >
                      {p.name}
                    </Link>
                    <button
                      onClick={() => toggleCompare(p)}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={products.length + 1}
                className="bg-movistar-navy/5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-movistar-navy"
              >
                Información general
              </td>
            </tr>
            {rows.map((row) => (
              <tr key={row.label} className="border-t">
                <td className="sticky left-0 z-10 whitespace-nowrap bg-movistar-gray px-4 py-3 text-xs font-semibold uppercase text-movistar-gray-med">
                  {row.label}
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center align-top">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}

            {specLabels.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={products.length + 1}
                    className="bg-movistar-navy/5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-movistar-navy"
                  >
                    Especificaciones técnicas
                  </td>
                </tr>
                {specLabels.map((label) => (
                  <tr key={`spec-${label}`} className="border-t">
                    <td className="sticky left-0 z-10 whitespace-nowrap bg-movistar-gray px-4 py-3 text-xs font-semibold uppercase text-movistar-gray-med">
                      {label}
                    </td>
                    {products.map((p) => (
                      <td
                        key={p.id}
                        className="px-4 py-3 text-center align-top text-xs text-movistar-gray-med"
                      >
                        {valueOfSpec(p, label)}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            )}

            {/* Acción: agregar al carrito */}
            <tr className="border-t">
              <td className="sticky left-0 z-10 bg-movistar-gray px-4 py-4" />
              {products.map((p) => (
                <td key={p.id} className="px-4 py-4 text-center">
                  <button
                    onClick={() => addToCart(p, 1)}
                    disabled={p.stock <= 0}
                    className={`w-full justify-center text-xs ${
                      p.stock <= 0
                        ? "btn-outline cursor-not-allowed opacity-50"
                        : "btn-primary"
                    }`}
                  >
                    {p.stock <= 0 ? "Agotado" : "Agregar al carrito"}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Link href="/catalogo" className="btn-outline">
          ← Seguir explorando
        </Link>
      </div>
    </div>
  );
}
