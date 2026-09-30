// Actualiza las referencias de imágenes en los JSON de datos usando las rutas
// del manifiesto (docs/image-manifest.json). Convierte cada "file" del
// manifiesto en una ruta pública "/img/..." y la asigna a productos,
// categorías y avatares de usuarios.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA = join(ROOT, "data");
const MANIFEST = join(ROOT, "..", "docs", "image-manifest.json");

const read = (f) => JSON.parse(readFileSync(join(DATA, f), "utf8"));
const write = (f, data) =>
  writeFileSync(join(DATA, f), JSON.stringify(data, null, 2) + "\n", "utf8");

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const pub = (file) => "/" + file.replace(/^\/+/, "");

// Índices por grupo/ref
const byProduct = {}; // ref -> [file ordenado por index]
const byCategory = {}; // ref -> file
const byAvatar = {}; // ref -> file

for (const e of manifest.images) {
  if (e.group === "product") {
    (byProduct[e.ref] ||= [])[e.index ?? 0] = pub(e.file);
  } else if (e.group === "category") {
    byCategory[e.ref] = pub(e.file);
  } else if (e.group === "avatar") {
    byAvatar[e.ref] = pub(e.file);
  }
}

// products.json
const products = read("products.json");
for (const p of products) {
  if (byProduct[p.id]) p.images = byProduct[p.id].filter(Boolean);
}
write("products.json", products);

// categories.json
const categories = read("categories.json");
for (const c of categories) {
  if (byCategory[c.id]) c.image = byCategory[c.id];
}
write("categories.json", categories);

// users.json (avatares por id, con fallback al default)
const users = read("users.json");
for (const u of users) {
  u.avatar = byAvatar[u.id] || byAvatar["default"] || u.avatar;
}
write("users.json", users);

console.log("Referencias actualizadas en products.json, categories.json y users.json");
