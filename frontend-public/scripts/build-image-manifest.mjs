// Construye docs/image-manifest.json a partir de los datos de la demo.
// Cada entrada define: id, name, file (ruta destino en public/), width, height
// y prompt (descripción para la IA de imágenes).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOCS = join(ROOT, "..", "docs");

const categories = JSON.parse(readFileSync(join(ROOT, "data/categories.json"), "utf8"));
const products = JSON.parse(readFileSync(join(ROOT, "data/products.json"), "utf8"));

const STYLE =
  "estilo fotografía de e-commerce, fondo limpio y neutro, iluminación de estudio suave, alta resolución, sin texto ni marcas de agua";

const catPromptHints = {
  movistar: "tienda de telefonía móvil moderna, smartphones y accesorios sobre fondo azul corporativo",
  tecnologia: "laptops, tablets y gadgets tecnológicos ordenados",
  hogar: "electrodomésticos y artículos de hogar en ambiente acogedor",
  moda: "prendas de ropa y accesorios de moda bien presentados",
  deportes: "equipamiento y ropa deportiva dinámica",
  belleza: "productos de cuidado personal y cosmética elegantes",
  juguetes: "juguetes coloridos y entretenidos para niños"
};

const entries = [];

// Categorías (banner de categoría, formato horizontal)
for (const c of categories) {
  entries.push({
    id: `category-${c.id}`,
    group: "category",
    ref: c.id,
    name: c.name,
    file: `img/categories/${c.id}.jpg`,
    width: 800,
    height: 600,
    prompt: `Imagen representativa de la categoría "${c.name}" para un marketplace: ${catPromptHints[c.id] || c.description}. ${STYLE}.`
  });
}

// Productos (una o dos vistas según data)
for (const p of products) {
  const n = Math.max(1, (p.images || []).length);
  for (let i = 0; i < n; i++) {
    const view =
      i === 0 ? "vista frontal principal" : "vista alternativa / de detalle en ángulo";
    entries.push({
      id: `product-${p.id}-${i}`,
      group: "product",
      ref: p.id,
      index: i,
      name: `${p.name}${i > 0 ? " (vista 2)" : ""}`,
      file: `img/products/${p.id}-${i}.jpg`,
      width: 800,
      height: 800,
      prompt: `Foto de producto de "${p.name}" de la marca ${p.brand}, categoría ${p.category}, ${view}. ${STYLE}.`
    });
  }
}

// Banners
entries.push({
  id: "banner-home",
  group: "banner",
  ref: "home",
  name: "Banner principal Home",
  file: "img/banners/home.jpg",
  width: 1200,
  height: 600,
  prompt: `Banner hero para la página de inicio de un marketplace llamado Integratel: personas comprando en línea, ambiente moderno y confiable, tonos azul Movistar. ${STYLE}.`
});
entries.push({
  id: "banner-login",
  group: "banner",
  ref: "login",
  name: "Banner de Login",
  file: "img/banners/login.jpg",
  width: 800,
  height: 600,
  prompt: `Ilustración/foto para pantalla de inicio de sesión de un marketplace: experiencia de compra online agradable, tonos azules corporativos. ${STYLE}.`
});
entries.push({
  id: "banner-seller-cta",
  group: "banner",
  ref: "seller-cta",
  name: "Banner CTA para Sellers",
  file: "img/banners/seller-cta.jpg",
  width: 1000,
  height: 600,
  prompt: `Banner motivador para invitar a vendedores a unirse a un marketplace: emprendedor gestionando su negocio con laptop y cajas de productos, ambiente positivo. ${STYLE}.`
});
entries.push({
  id: "banner-hero-movistar",
  group: "banner",
  ref: "hero-movistar",
  name: "Hero slide Movistar",
  file: "img/banners/hero-movistar.jpg",
  width: 1000,
  height: 700,
  prompt: `Banner hero de equipos móviles Movistar: smartphones modernos y accesorios sobre fondo azul corporativo, aspecto premium. ${STYLE}.`
});
entries.push({
  id: "banner-hero-ofertas",
  group: "banner",
  ref: "hero-ofertas",
  name: "Hero slide Ofertas",
  file: "img/banners/hero-ofertas.jpg",
  width: 1000,
  height: 700,
  prompt: `Banner hero de promociones y ofertas de un marketplace: variedad de productos con etiquetas de descuento, ambiente dinámico y llamativo. ${STYLE}.`
});

// Avatares demo
for (const [ref, desc] of [
  ["user-001", "retrato de una mujer profesional sonriente, fondo neutro"],
  ["seller-001", "retrato de un hombre emprendedor sonriente, fondo neutro"],
  ["default", "avatar genérico de usuario, silueta amigable, fondo neutro"]
]) {
  entries.push({
    id: `avatar-${ref}`,
    group: "avatar",
    ref,
    name: `Avatar ${ref}`,
    file: `img/avatars/${ref}.jpg`,
    width: 400,
    height: 400,
    prompt: `Foto de avatar: ${desc}. ${STYLE}.`
  });
}

const manifest = {
  generatedFrom: "categories.json + products.json",
  targetPublicDir: "frontend-public/public",
  defaultStyle: STYLE,
  count: entries.length,
  images: entries
};

mkdirSync(DOCS, { recursive: true });
writeFileSync(
  join(DOCS, "image-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8"
);

console.log(`Manifiesto generado: docs/image-manifest.json (${entries.length} imágenes)`);
