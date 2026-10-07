"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { aggregateRating } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

const LOW_STOCK = 5;

// Estrellas de valoración (rellenas según el rating entero).
function Stars({ value }) {
  const full = Math.round(value);
  return (
    <span className="text-yellow-500" aria-label={`${value} de 5 estrellas`}>
      {"★".repeat(full)}
      <span className="text-gray-300">{"★".repeat(5 - full)}</span>
    </span>
  );
}

// Selector de estrellas interactivo para el formulario de reseña.
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Puntuación">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className={`text-2xl leading-none transition-colors ${
            n <= (hover || value) ? "text-yellow-500" : "text-gray-300"
          }`}
          aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
          aria-pressed={value === n}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// Iniciales para el avatar del autor de la reseña.
function initials(name) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProductDetail({ product, related, reviews = [] }) {
  const {
    addToCart,
    isFavorite,
    toggleFavorite,
    registerRecent,
    addReview,
    getUserReviews,
    user
  } = useStore();

  const [qty, setQty] = useState(1);
  const [showAll, setShowAll] = useState(false);

  // Formulario de reseña.
  const [form, setForm] = useState({ rating: 0, title: "", comment: "" });
  const [formError, setFormError] = useState("");

  // Registra el producto como "visto recientemente" al montar.
  useEffect(() => {
    registerRecent(product.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // Reseñas de la comunidad escritas en este navegador para este producto.
  const communityReviews = getUserReviews(product.id);

  // Combina las reseñas demo con las de la comunidad (más recientes primero).
  const allReviews = useMemo(() => {
    return [...communityReviews, ...reviews].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [communityReviews, reviews]);

  // Promedio: combina el rating base del producto con TODAS las reseñas
  // concretas disponibles (demo + comunidad) ponderando por conteo.
  const { average: avgRating, count: ratingCount } = aggregateRating(
    product,
    allReviews
  );

  const visibleReviews = showAll ? allReviews : allReviews.slice(0, 3);

  const fav = isFavorite(product.id);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= LOW_STOCK;

  const specs =
    product.specs && product.specs.length > 0
      ? product.specs
      : [
          { label: "Marca", value: product.brand },
          { label: "Proveedor", value: product.provider },
          { label: "Categoría", value: product.category },
          { label: "Disponibilidad", value: `${product.stock} unidades` }
        ];

  const discount =
    product.listPrice > product.price
      ? Math.round((1 - product.price / product.listPrice) * 100)
      : 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addToCart(product, qty);
  };

  const submitReview = (e) => {
    e.preventDefault();
    setFormError("");
    if (form.rating < 1) {
      setFormError("Selecciona una puntuación de 1 a 5 estrellas.");
      return;
    }
    if (!form.comment.trim()) {
      setFormError("Escribe un comentario para publicar tu reseña.");
      return;
    }
    addReview({
      productId: product.id,
      author: user?.name || "Usuario anónimo",
      rating: form.rating,
      title: form.title.trim(),
      comment: form.comment.trim()
    });
    setForm({ rating: 0, title: "", comment: "" });
  };

  return (
    <div className="container-page py-8">
      <nav className="mb-6 text-sm text-movistar-gray-med">
        <Link href="/" className="hover:underline">
          Inicio
        </Link>{" "}
        /{" "}
        <Link href="/catalogo" className="hover:underline">
          Catálogo
        </Link>{" "}
        / <span className="text-movistar-navy">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card overflow-hidden p-4">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images?.[0]}
              alt={product.name}
              className={`aspect-square w-full rounded-xl object-cover ${
                outOfStock ? "opacity-60 grayscale" : ""
              }`}
            />
            {outOfStock ? (
              <span className="badge absolute left-3 top-3 bg-movistar-gray-med text-white">
                Agotado
              </span>
            ) : lowStock ? (
              <span className="badge absolute left-3 top-3 animate-pulse bg-red-500 text-white">
                ¡Últimas {product.stock}!
              </span>
            ) : null}
          </div>
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
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm uppercase text-movistar-gray-med">
              {product.brand} · {product.provider}
            </span>
            <button
              type="button"
              onClick={() => toggleFavorite(product)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                fav
                  ? "bg-red-500 text-white"
                  : "border border-gray-300 text-movistar-navy hover:border-red-400 hover:text-red-500"
              }`}
              aria-pressed={fav}
            >
              {fav ? "❤️ En favoritos" : "🤍 Añadir a favoritos"}
            </button>
          </div>
          <h1 className="mt-1 text-3xl font-bold text-movistar-navy">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Stars value={avgRating} />
            <span className="text-movistar-gray-med">
              {avgRating} · {ratingCount} reseñas
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
            {outOfStock ? (
              <span className="text-red-500">● Agotado</span>
            ) : lowStock ? (
              <span className="font-semibold text-red-500">
                ● ¡Últimas {product.stock} unidades!
              </span>
            ) : (
              <span className="text-movistar-green">
                ● En stock ({product.stock} disponibles)
              </span>
            )}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-lg"
                disabled={outOfStock}
              >
                −
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="px-4 py-2 text-lg"
                disabled={outOfStock}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className={`flex-1 ${
                outOfStock
                  ? "btn-outline cursor-not-allowed opacity-50"
                  : "btn-primary"
              }`}
            >
              {outOfStock ? "Agotado" : "Agregar al carrito"}
            </button>
          </div>

          <Link href="/checkout/carrito" className="btn-outline mt-3 w-full">
            Ir al carrito
          </Link>
        </div>
      </div>

      {/* Características y especificaciones técnicas */}
      <section className="mt-14">
        <h2 className="mb-6 text-2xl font-bold text-movistar-navy">
          Características y especificaciones técnicas
        </h2>
        <div className="card overflow-hidden">
          <dl className="divide-y">
            {specs.map((s, i) => (
              <div
                key={s.label}
                className={`grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[220px_1fr] sm:gap-4 ${
                  i % 2 === 1 ? "bg-movistar-gray/40" : ""
                }`}
              >
                <dt className="text-sm font-semibold text-movistar-navy">
                  {s.label}
                </dt>
                <dd className="text-sm text-movistar-gray-med">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Reseñas y comentarios */}
      <section className="mt-14">
        <h2 className="mb-6 text-2xl font-bold text-movistar-navy">
          Reseñas y comentarios
        </h2>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Resumen de valoración */}
          <aside className="card h-fit p-6 text-center">
            <p className="text-5xl font-black text-movistar-navy">
              {avgRating}
            </p>
            <div className="mt-1 text-lg">
              <Stars value={avgRating} />
            </div>
            <p className="mt-2 text-sm text-movistar-gray-med">
              Promedio sobre {ratingCount} reseñas
            </p>
            {communityReviews.length > 0 && (
              <p className="mt-1 text-xs text-movistar-green">
                Incluye {communityReviews.length} de la comunidad
              </p>
            )}
          </aside>

          <div className="space-y-6">
            {/* Formulario para escribir una reseña */}
            <form onSubmit={submitReview} className="card p-5">
              <h3 className="font-bold text-movistar-navy">
                Escribe tu reseña
              </h3>
              <p className="mt-1 text-sm text-movistar-gray-med">
                Comparte tu experiencia con este producto.
              </p>
              <div className="mt-3">
                <span className="mb-1 block text-xs font-semibold uppercase text-movistar-gray-med">
                  Tu puntuación
                </span>
                <StarPicker
                  value={form.rating}
                  onChange={(rating) => setForm((f) => ({ ...f, rating }))}
                />
              </div>
              <label className="mt-3 block text-sm">
                Título (opcional)
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="input mt-1"
                  placeholder="Resumen de tu opinión"
                  maxLength={80}
                />
              </label>
              <label className="mt-3 block text-sm">
                Comentario
                <textarea
                  value={form.comment}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, comment: e.target.value }))
                  }
                  className="input mt-1 min-h-[90px] resize-y"
                  placeholder="¿Qué te pareció? ¿Lo recomendarías?"
                  maxLength={600}
                />
              </label>
              {formError && (
                <p className="mt-2 text-xs text-red-500">{formError}</p>
              )}
              <button type="submit" className="btn-primary mt-4">
                Publicar reseña
              </button>
            </form>

            {/* Lista de comentarios */}
            {allReviews.length === 0 ? (
              <div className="card p-8 text-center text-movistar-gray-med">
                Este producto aún no tiene comentarios. ¡Sé el primero en
                opinar!
              </div>
            ) : (
              <>
                {visibleReviews.map((r) => (
                  <article key={r.id} className="card p-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-movistar-blue/10 text-sm font-bold text-movistar-blue">
                        {initials(r.author)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3">
                          <p className="font-semibold text-movistar-navy">
                            {r.author}
                            {String(r.id).startsWith("urev-") && (
                              <span className="badge ml-2 bg-movistar-green/10 text-movistar-green">
                                Tu reseña
                              </span>
                            )}
                          </p>
                          <time className="text-xs text-movistar-gray-med">
                            {formatDate(r.date)}
                          </time>
                        </div>
                        <div className="mt-0.5 text-sm">
                          <Stars value={r.rating} />
                        </div>
                        {r.title && (
                          <p className="mt-2 font-semibold text-movistar-navy">
                            {r.title}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-movistar-gray-med">
                          {r.comment}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}

                {allReviews.length > 3 && (
                  <button
                    onClick={() => setShowAll((v) => !v)}
                    className="btn-outline w-full"
                  >
                    {showAll
                      ? "Ver menos comentarios"
                      : `Ver todos los comentarios (${allReviews.length})`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>

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
