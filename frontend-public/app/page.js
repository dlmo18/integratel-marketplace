import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CategoryCarousel from "@/components/CategoryCarousel";
import HeroSlider from "@/components/HeroSlider";
import FavoritesBlock from "@/components/FavoritesBlock";
import RecentlyViewed from "@/components/RecentlyViewed";
import heroData from "@/data/hero-slides.json";
import {
  getFeaturedProducts,
  getBestSellers,
  getOnSale,
  getCategories
} from "@/lib/data";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 8);
  const bestSellers = getBestSellers().slice(0, 4);
  const onSale = getOnSale().slice(0, 4);
  const categories = getCategories();

  return (
    <div>
      <HeroSlider slides={heroData.slides} autoplayMs={heroData.autoplayMs} />

      {/* Categorías */}
      <section className="md-section">
        <div className="md-container">
          <div className="section-head">
            <div>
              <h2 className="md-headline-medium">Explora por categoría</h2>
              <p className="sub md-body-medium">
                Acceso directo a todo nuestro catálogo
              </p>
            </div>
          </div>
          <CategoryCarousel categories={categories} />
        </div>
      </section>

      {/* Productos destacados */}
      <section className="md-section">
        <div className="md-container">
          <div className="section-head">
            <h2 className="md-headline-medium">Productos destacados</h2>
            <Link href="/catalogo" className="section-link">Ver todo →</Link>
          </div>
          <div className="prod-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Tus favoritos */}
      <FavoritesBlock />

      {/* CTA más vendidos + promociones */}
      <section className="md-section" style={{ paddingBlock: 0 }}>
        <div className="md-container">
          <div className="cta-duo">
            <div className="cta-box cta-primary">
              <h3>Los más vendidos 🔥</h3>
              <p>Descubre lo que todos están comprando esta temporada.</p>
              <Link href="/catalogo?orden=vendidos" className="md-btn md-btn-on-dark md-state">
                Ver más vendidos
              </Link>
            </div>
            <div className="cta-box cta-secondary">
              <h3>Promociones 🏷️</h3>
              <p>Ofertas por tiempo limitado en cientos de productos.</p>
              <Link href="/catalogo?orden=ofertas" className="md-btn md-btn-on-dark md-state">
                Ver promociones
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top ventas */}
      <section className="md-section">
        <div className="md-container">
          <h2 className="md-headline-medium" style={{ marginBottom: 24 }}>Top ventas</h2>
          <div className="prod-grid">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Ofertas */}
      <section className="md-section" style={{ paddingTop: 0 }}>
        <div className="md-container">
          <h2 className="md-headline-medium" style={{ marginBottom: 24 }}>Ofertas de la semana</h2>
          <div className="prod-grid">
            {onSale.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Vistos recientemente */}
      <RecentlyViewed />

      {/* CTA Seller */}
      <section className="md-section">
        <div className="md-container">
          <div className="seller-cta">
            <div>
              <h2>Conviértete en Seller y haz crecer tu negocio</h2>
              <p>
                Publica tus productos, gestiona tu stock y llega a miles de
                clientes en todo el Perú. Sin costo de registro en la demo.
              </p>
              <Link href="/registro?tipo=seller" className="md-btn md-btn-on-dark md-state" style={{ marginTop: 24 }}>
                Empezar a vender
              </Link>
            </div>
            <ul>
              <li>✅ Panel de ventas y transacciones</li>
              <li>✅ Gestión de items, stock y precios</li>
              <li>✅ Seguimiento de pagos y payouts</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
