"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/lib/format";

const LOW_STOCK = 5;

export default function ProductCard({ product, showCompare = true }) {
  const {
    addToCart,
    isFavorite,
    toggleFavorite,
    isComparing,
    toggleCompare,
    canAddCompare
  } = useStore();

  const discount =
    product.listPrice && product.listPrice > product.price
      ? Math.round((1 - product.price / product.listPrice) * 100)
      : 0;

  const fav = isFavorite(product.id);
  const comparing = isComparing(product.id);
  const compareDisabled = !comparing && !canAddCompare;
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= LOW_STOCK;

  return (
    <article className="md-card md-card-elevated pcard">
      <div className="pcard-media">
        <Link href={`/producto/${product.slug}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images?.[0]}
            alt={product.name}
            className={outOfStock ? "out" : ""}
            loading="lazy"
          />
        </Link>

        <div className="pcard-badges">
          {discount > 0 && (
            <span className="md-badge md-badge-secondary">-{discount}%</span>
          )}
          {product.category === "movistar" && (
            <span className="md-badge md-badge-primary">Movistar</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          className={`pcard-fav md-state ${fav ? "on" : ""}`}
          aria-pressed={fav}
          aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
          title={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <span className="material-symbols-outlined filled" style={{ fontSize: 20 }}>
            favorite
          </span>
        </button>

        {outOfStock ? (
          <span className="md-badge md-badge-neutral pcard-stock">Agotado</span>
        ) : lowStock ? (
          <span className="md-badge md-badge-error pcard-stock">
            ¡Últimas {product.stock}!
          </span>
        ) : null}
      </div>

      <div className="pcard-body">
        {showCompare && (
          <label
            className="md-row"
            style={{
              gap: 6,
              fontSize: "0.75rem",
              fontWeight: 500,
              color: compareDisabled ? "var(--md-outline)" : "var(--md-on-surface-variant)",
              cursor: compareDisabled ? "not-allowed" : "pointer",
              marginBottom: 6
            }}
            title={compareDisabled ? "Máximo 4 productos" : "Agregar a comparación"}
          >
            <input
              type="checkbox"
              checked={comparing}
              disabled={compareDisabled}
              onChange={() => toggleCompare(product)}
              style={{ accentColor: "var(--md-primary)" }}
            />
            Comparar
          </label>
        )}
        <span className="pcard-brand">{product.brand}</span>
        <Link href={`/producto/${product.slug}`} className="pcard-name">
          {product.name}
        </Link>
        <div className="pcard-rating">
          <span className="material-symbols-outlined filled" style={{ fontSize: 14 }}>
            star
          </span>
          {product.rating}
          <span className="count">({product.reviews})</span>
        </div>
        <div className="pcard-price-row">
          <span className="pcard-price">
            {formatCurrency(product.price, product.currency)}
          </span>
          {discount > 0 && (
            <span className="pcard-list">
              {formatCurrency(product.listPrice, product.currency)}
            </span>
          )}
        </div>
        <button
          onClick={() => addToCart(product, 1)}
          disabled={outOfStock}
          className={`md-btn pcard-cta md-state ${
            outOfStock ? "md-btn-outlined" : "md-btn-filled"
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            {outOfStock ? "block" : "add_shopping_cart"}
          </span>
          {outOfStock ? "Agotado" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
}
