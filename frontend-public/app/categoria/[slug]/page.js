import { notFound } from "next/navigation";
import CategoryClient from "./CategoryClient";
import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory
} from "@/lib/data";

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const category = getCategoryBySlug(params.slug);
  return {
    title: category
      ? `${category.name} · Integratel Marketplace`
      : "Categoría"
  };
}

export default function CategoryPage({ params }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);

  return <CategoryClient category={category} products={products} />;
}
