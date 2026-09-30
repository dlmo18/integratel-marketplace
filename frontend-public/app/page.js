import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CategoryCarousel from "@/components/CategoryCarousel";
import HeroSlider from "@/components/HeroSlider";
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
      {/* Hero slider */}
      <HeroSlider slides={heroData.slides} autoplayMs={heroData.autoplayMs} />

      {/* Categorías destacadas */}
      <section className="py-12">
        <div className="container-page mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-movistar-navy">
              Explora por categoría
            </h2>
            <p className="text-sm text-movistar-gray-med">
              Acceso directo a todo nuestro catálogo
            </p>
          </div>
        </div>
        <CategoryCarousel categories={categories} />
      </section>

      {/* Productos destacados */}
      <section className="container-page py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-movistar-navy">
            Productos destacados
          </h2>
          <Link href="/catalogo" className="text-sm font-semibold text-movistar-blue hover:underline">
            Ver todo →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA más vendidos + promociones */}
      <section className="container-page grid gap-6 py-6 lg:grid-cols-2">
        <div className="flex flex-col justify-center rounded-3xl bg-movistar-navy p-8 text-white">
          <h3 className="text-2xl font-bold">Los más vendidos 🔥</h3>
          <p className="mt-2 text-white/80">
            Descubre lo que todos están comprando esta temporada.
          </p>
          <Link href="/catalogo?orden=vendidos" className="btn-primary mt-4 w-fit">
            Ver más vendidos
          </Link>
        </div>
        <div className="flex flex-col justify-center rounded-3xl bg-movistar-green p-8 text-white">
          <h3 className="text-2xl font-bold">Promociones 🏷️</h3>
          <p className="mt-2 text-white/90">
            Ofertas por tiempo limitado en cientos de productos.
          </p>
          <Link
            href="/catalogo?orden=ofertas"
            className="btn mt-4 w-fit bg-white text-movistar-green hover:bg-white/90"
          >
            Ver promociones
          </Link>
        </div>
      </section>

      {/* Más vendidos grid */}
      <section className="container-page py-12">
        <h2 className="mb-6 text-2xl font-bold text-movistar-navy">
          Top ventas
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Ofertas grid */}
      <section className="container-page py-6">
        <h2 className="mb-6 text-2xl font-bold text-movistar-navy">
          Ofertas de la semana
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {onSale.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA Seller */}
      <section className="container-page py-12">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-r from-movistar-blue to-movistar-navy p-10 text-white lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black">
              Conviértete en Seller y haz crecer tu negocio
            </h2>
            <p className="mt-3 max-w-lg text-white/80">
              Publica tus productos, gestiona tu stock y llega a miles de
              clientes en todo el Perú. Sin costo de registro en la demo.
            </p>
            <Link href="/registro?tipo=seller" className="btn-green mt-6">
              Empezar a vender
            </Link>
          </div>
          <ul className="grid gap-3 text-sm">
            <li className="rounded-xl bg-white/10 p-4">✅ Panel de ventas y transacciones</li>
            <li className="rounded-xl bg-white/10 p-4">✅ Gestión de items, stock y precios</li>
            <li className="rounded-xl bg-white/10 p-4">✅ Seguimiento de pagos y payouts</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
