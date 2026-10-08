import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";
import {
  getProductBySlug,
  getProducts,
  getProductsByCategory,
  getReviewsByProduct
} from "@/lib/data";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);
  return { title: product ? `${product.name} · Movistar` : "Producto" };
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const reviews = getReviewsByProduct(product.id);

  return (
    <ProductDetail product={product} related={related} reviews={reviews} />
  );
}
