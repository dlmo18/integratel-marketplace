// Reescribe las rutas de imágenes en los JSON para usar picsum.photos con
// seeds estables (cada producto/categoría muestra siempre la misma foto).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "data");

const read = (f) => JSON.parse(readFileSync(join(DATA, f), "utf8"));
const write = (f, data) =>
  writeFileSync(join(DATA, f), JSON.stringify(data, null, 2) + "\n", "utf8");

const picsum = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

// products.json -> foto estable por producto e índice
const products = read("products.json");
for (const p of products) {
  const n = Math.max(1, (p.images || []).length);
  p.images = Array.from({ length: n }, (_, i) => picsum(`${p.id}-${i}`, 600, 600));
}
write("products.json", products);

// categories.json -> foto estable por categoría
const categories = read("categories.json");
for (const c of categories) {
  c.image = picsum(`cat-${c.id}`, 600, 400);
}
write("categories.json", categories);

// users.json -> avatares estables
const users = read("users.json");
for (const u of users) {
  u.avatar = picsum(`avatar-${u.id}`, 200, 200);
}
write("users.json", users);

console.log("Rutas de imágenes reescritas a picsum.photos (seeds estables)");
