"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/lib/format";

export default function ProductDetail({ product, related }) {
  const { addToCart } = useStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const discount =
    product.listPrice > product.price
      ? Math.round((1 - product.price / product.listPrice) * 100)
      : 0;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container-page py-8">
      <nav className="mb-6 text-sm text-movistar-gray-med">
        <Link href="/" className="hover:underline">Inicio</Link> /{" "}
        <Link href="/catalogo" className="hover:underline">Catálogo</Link> /{" "}
        <span className="text-movistar-navy">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card overflow-hidden p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="aspect-square w-full rounded-xl object-cover"
          />
          {product.images?.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  className="aspect-square rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-sm uppercase text-movistar-gray-med">
            {product.brand} · {product.provider}
          </span>
          <h1 className="mt-1 text-3xl font-bold text-movistar-navy">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-yellow-500">
            {"★".repeat(Math.round(product.rating))}
            <span className="text-movistar-gray-med">
              {product.rating} · {product.reviews} reseñas
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-black text-movistar-navy">
              {formatCurrency(product.price, product.currency)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-lg text-movistar-gray-med line-through">
                  {formatCurrency(product.listPrice, product.currency)}
                </span>
                <span className="badge bg-movistar-green text-white">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-movistar-gray-med">{product.description}</p>

          <p className="mt-4 text-sm">
            {product.stock > 0 ? (
              <span className="text-movistar-green">
                ● En stock ({product.stock} disponibles)
              </span>
            ) : (
              <span className="text-red-500">● Agotado</span>
            )}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-lg"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="px-4 py-2 text-lg"
              >
                +
              </button>
            </div>
            <button onClick={handleAdd} className="btn-primary flex-1">
              {added ? "✓ Agregado" : "Agregar al carrito"}
            </button>
          </div>

          <Link href="/checkout/carrito" className="btn-outline mt-3 w-full">
            Ir al carrito
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-bold text-movistar-navy">
            Productos relacionados
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/producto/${p.slug}`}
                className="card overflow-hidden transition-transform hover:-translate-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold">{p.name}</p>
                  <p className="mt-1 font-bold text-movistar-navy">
                    {formatCurrency(p.price, p.currency)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
