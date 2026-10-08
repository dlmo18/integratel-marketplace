"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { aggregateRating } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

const LOW_STOCK = 5;

function Stars({ value }) {
  const full = Math.round(value);
  return (
    <span style={{ color: "#e8a500", letterSpacing: 1 }} aria-label={`${value} de 5 estrellas`}>
      {"★".repeat(full)}
      <span style={{ color: "var(--md-outline-variant)" }}>{"★".repeat(5 - full)}</span>
    </span>
  );
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }} role="radiogroup" aria-label="Puntuación">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.6rem",
            lineHeight: 1,
            color: n <= (hover || value) ? "#e8a500" : "var(--md-outline-variant)"
          }}
          aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
          aria-pressed={value === n}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function initials(name) {
  return (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
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
  const [form, setForm] = useState({ rating: 0, title: "", comment: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    registerRecent(product.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const communityReviews = getUserReviews(product.id);

  const allReviews = useMemo(
    () => [...communityReviews, ...reviews].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [communityReviews, reviews]
  );

  const { average: avgRating, count: ratingCount } = aggregateRating(product, allReviews);
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
    if (form.rating < 1) return setFormError("Selecciona una puntuación de 1 a 5 estrellas.");
    if (!form.comment.trim()) return setFormError("Escribe un comentario para publicar tu reseña.");
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
    <div className="md-container md-page">
      <nav className="md-crumbs">
        <Link href="/">Inicio</Link> / <Link href="/catalogo">Catálogo</Link> /{" "}
        <span style={{ color: "var(--md-on-surface)" }}>{product.name}</span>
      </nav>

      <div style={{ display: "grid", gap: 32, gridTemplateColumns: "1fr" }} className="pd-grid">
        <div className="md-card md-card-elevated md-card-pad-sm">
          <div style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images?.[0]}
              alt={product.name}
              style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "var(--md-shape-md)", filter: outOfStock ? "grayscale(1)" : "none", opacity: outOfStock ? 0.6 : 1 }}
            />
            {outOfStock ? (
              <span className="md-badge md-badge-neutral" style={{ position: "absolute", top: 12, left: 12 }}>Agotado</span>
            ) : lowStock ? (
              <span className="md-badge md-badge-error" style={{ position: "absolute", top: 12, left: 12 }}>¡Últimas {product.stock}!</span>
            ) : null}
          </div>
          {product.images?.length > 1 && (
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {product.images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={img} alt={`${product.name} ${i + 1}`} style={{ aspectRatio: "1/1", objectFit: "cover", borderRadius: "var(--md-shape-sm)" }} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="md-row-between" style={{ alignItems: "flex-start" }}>
            <span className="md-muted" style={{ textTransform: "uppercase", fontSize: "0.8rem" }}>
              {product.brand} · {product.provider}
            </span>
            <button
              type="button"
              onClick={() => toggleFavorite(product)}
              className={`md-btn md-btn-sm md-state ${fav ? "md-btn-filled" : "md-btn-outlined"}`}
              style={fav ? { background: "var(--md-error)", color: "#fff" } : undefined}
              aria-pressed={fav}
            >
              <span className="material-symbols-outlined filled" style={{ fontSize: 18 }}>favorite</span>
              {fav ? "En favoritos" : "Favorito"}
            </button>
          </div>
          <h1 className="md-headline-large" style={{ marginTop: 4 }}>{product.name}</h1>
          <div className="md-row" style={{ gap: 8, marginTop: 8 }}>
            <Stars value={avgRating} />
            <span className="md-muted md-body-medium">{avgRating} · {ratingCount} reseñas</span>
          </div>

          <div className="md-row" style={{ gap: 12, alignItems: "baseline", marginTop: 16 }}>
            <span className="md-display-small" style={{ fontWeight: 800 }}>
              {formatCurrency(product.price, product.currency)}
            </span>
            {discount > 0 && (
              <>
                <span className="md-muted md-strike" style={{ fontSize: "1.1rem" }}>
                  {formatCurrency(product.listPrice, product.currency)}
                </span>
                <span className="md-badge md-badge-secondary">-{discount}%</span>
              </>
            )}
          </div>

          <p className="md-muted" style={{ marginTop: 16 }}>{product.description}</p>

          <p style={{ marginTop: 16, fontSize: "0.9rem" }}>
            {outOfStock ? (
              <span style={{ color: "var(--md-error)" }}>● Agotado</span>
            ) : lowStock ? (
              <span style={{ color: "var(--md-error)", fontWeight: 600 }}>● ¡Últimas {product.stock} unidades!</span>
            ) : (
              <span style={{ color: "var(--md-secondary)" }}>● En stock ({product.stock} disponibles)</span>
            )}
          </p>

          <div className="md-row" style={{ gap: 16, marginTop: 24 }}>
            <div className="qty-group">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={outOfStock}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={outOfStock}>+</button>
            </div>
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className={`md-btn md-grow md-state ${outOfStock ? "md-btn-outlined" : "md-btn-filled"}`}
            >
              {outOfStock ? "Agotado" : "Agregar al carrito"}
            </button>
          </div>

          <Link href="/checkout/carrito" className="md-btn md-btn-outlined md-btn-block md-state" style={{ marginTop: 12 }}>
            Ir al carrito
          </Link>
        </div>
      </div>

      {/* Especificaciones */}
      <section style={{ marginTop: 56 }}>
        <h2 className="md-headline-small" style={{ marginBottom: 24 }}>
          Características y especificaciones técnicas
        </h2>
        <div className="md-card md-card-elevated">
          <dl className="md-dl">
            {specs.map((s) => (
              <div className="row" key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Reseñas */}
      <section style={{ marginTop: 56 }}>
        <h2 className="md-headline-small" style={{ marginBottom: 24 }}>Reseñas y comentarios</h2>

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr" }} className="pd-reviews">
          <aside className="md-card md-card-elevated md-card-pad md-center" style={{ height: "fit-content" }}>
            <p className="md-display-small" style={{ margin: 0, fontWeight: 800 }}>{avgRating}</p>
            <div style={{ marginTop: 4, fontSize: "1.1rem" }}><Stars value={avgRating} /></div>
            <p className="md-muted md-body-medium" style={{ marginTop: 8 }}>Promedio sobre {ratingCount} reseñas</p>
            {communityReviews.length > 0 && (
              <p style={{ marginTop: 4, fontSize: "0.75rem", color: "var(--md-secondary)" }}>
                Incluye {communityReviews.length} de la comunidad
              </p>
            )}
          </aside>

          <div className="md-stack">
            {/* Formulario */}
            <form onSubmit={submitReview} className="md-card md-card-elevated md-card-pad-sm">
              <h3 className="md-title-medium" style={{ margin: 0 }}>Escribe tu reseña</h3>
              <p className="md-muted md-body-medium" style={{ marginTop: 4 }}>Comparte tu experiencia con este producto.</p>
              <div style={{ marginTop: 12 }}>
                <span className="md-form-label">Tu puntuación</span>
                <StarPicker value={form.rating} onChange={(rating) => setForm((f) => ({ ...f, rating }))} />
              </div>
              <div style={{ marginTop: 12 }}>
                <label className="md-form-label">Título (opcional)</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="md-input" placeholder="Resumen de tu opinión" maxLength={80} />
              </div>
              <div style={{ marginTop: 12 }}>
                <label className="md-form-label">Comentario</label>
                <textarea value={form.comment} onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))} className="md-textarea" placeholder="¿Qué te pareció? ¿Lo recomendarías?" maxLength={600} />
              </div>
              {formError && <p style={{ marginTop: 8, fontSize: "0.75rem", color: "var(--md-error)" }}>{formError}</p>}
              <button type="submit" className="md-btn md-btn-filled md-state" style={{ marginTop: 16 }}>Publicar reseña</button>
            </form>

            {allReviews.length === 0 ? (
              <div className="md-card md-card-outlined md-card-pad md-center md-muted">
                Este producto aún no tiene comentarios. ¡Sé el primero en opinar!
              </div>
            ) : (
              <>
                {visibleReviews.map((r) => (
                  <article key={r.id} className="md-card md-card-elevated md-card-pad-sm">
                    <div className="md-row" style={{ gap: 12, alignItems: "flex-start" }}>
                      <span style={{ display: "inline-flex", height: 40, width: 40, flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "color-mix(in srgb, var(--md-primary) 12%, transparent)", color: "var(--md-primary)", fontWeight: 700, fontSize: "0.8rem" }}>
                        {initials(r.author)}
                      </span>
                      <div className="md-grow" style={{ minWidth: 0 }}>
                        <div className="md-row-between md-wrap">
                          <p className="md-title-small" style={{ margin: 0 }}>
                            {r.author}
                            {String(r.id).startsWith("urev-") && (
                              <span className="md-badge md-badge-container" style={{ marginLeft: 8 }}>Tu reseña</span>
                            )}
                          </p>
                          <time className="md-muted" style={{ fontSize: "0.75rem" }}>{formatDate(r.date)}</time>
                        </div>
                        <div style={{ marginTop: 2 }}><Stars value={r.rating} /></div>
                        {r.title && <p className="md-title-small" style={{ margin: "8px 0 0" }}>{r.title}</p>}
                        <p className="md-muted md-body-medium" style={{ marginTop: 4 }}>{r.comment}</p>
                      </div>
                    </div>
                  </article>
                ))}
                {allReviews.length > 3 && (
                  <button onClick={() => setShowAll((v) => !v)} className="md-btn md-btn-outlined md-btn-block md-state">
                    {showAll ? "Ver menos comentarios" : `Ver todos los comentarios (${allReviews.length})`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ marginTop: 56 }}>
          <h2 className="md-headline-small" style={{ marginBottom: 24 }}>Productos relacionados</h2>
          <div className="prod-grid">
            {related.map((p) => (
              <Link key={p.id} href={`/producto/${p.slug}`} className="md-card md-card-elevated pcard md-state">
                <div className="pcard-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images?.[0]} alt={p.name} />
                </div>
                <div className="pcard-body" style={{ padding: 12 }}>
                  <span className="pcard-name">{p.name}</span>
                  <p className="pcard-price" style={{ marginTop: 4 }}>{formatCurrency(p.price, p.currency)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
