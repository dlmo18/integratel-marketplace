// Genera el banco de imágenes de la demo a partir de docs/image-manifest.json.
//
// Proveedores soportados (elige automáticamente según variables de entorno):
//   - OpenAI   : OPENAI_API_KEY   (modelo gpt-image-1)
//   - Gemini   : GEMINI_API_KEY   (modelo imagen-3 / images:generate)
//   - Fallback : sin API key -> descarga una foto real estable desde picsum
//
// Uso:
//   OPENAI_API_KEY=sk-... node scripts/generate-ai-images.mjs
//   GEMINI_API_KEY=...    node scripts/generate-ai-images.mjs
//   node scripts/generate-ai-images.mjs            (modo fallback)
//   node scripts/generate-ai-images.mjs --only=product   (filtra por grupo)
//   node scripts/generate-ai-images.mjs --force          (regenera existentes)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Buffer } from "node:buffer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const MANIFEST = join(ROOT, "..", "docs", "image-manifest.json");

const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith("--only=")) || "").split("=")[1];
const force = args.includes("--force");

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

const provider = OPENAI_KEY ? "openai" : GEMINI_KEY ? "gemini" : "fallback";

const ensureDir = (file) => mkdirSync(dirname(file), { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function saveBuffer(file, buf) {
  ensureDir(file);
  writeFileSync(file, buf);
}

// --- Proveedores ------------------------------------------------------------
async function genOpenAI(prompt, w, h) {
  const size =
    w === h ? "1024x1024" : w > h ? "1536x1024" : "1024x1536";
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size,
      n: 1
    })
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI: respuesta sin imagen");
  return Buffer.from(b64, "base64");
}

async function genGemini(prompt) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=" +
    GEMINI_KEY;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1 }
    })
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const b64 = json.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error("Gemini: respuesta sin imagen");
  return Buffer.from(b64, "base64");
}

// Fallback: foto real y estable desde picsum usando el id como semilla.
async function genFallback(entry) {
  const url = `https://picsum.photos/seed/${entry.id}/${entry.width}/${entry.height}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Fallback ${res.status} en ${url}`);
  const arr = await res.arrayBuffer();
  return Buffer.from(arr);
}

async function generate(entry) {
  if (provider === "openai") return genOpenAI(entry.prompt, entry.width, entry.height);
  if (provider === "gemini") return genGemini(entry.prompt);
  return genFallback(entry);
}

// --- Main -------------------------------------------------------------------
async function main() {
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
  let images = manifest.images;
  if (only) images = images.filter((i) => i.group === only);

  console.log(`Proveedor: ${provider} | imágenes a procesar: ${images.length}`);
  if (provider === "fallback") {
    console.log(
      "⚠  Sin API key (OPENAI_API_KEY / GEMINI_API_KEY). Usando fallback de descarga."
    );
  }

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of images) {
    const outFile = join(PUBLIC, entry.file);
    if (!force && existsSync(outFile)) {
      skipped++;
      continue;
    }
    try {
      const buf = await generate(entry);
      await saveBuffer(outFile, buf);
      ok++;
      console.log(`✓ ${entry.file}  (${entry.name})`);
      // pequeño respiro para no saturar la API
      if (provider !== "fallback") await sleep(500);
    } catch (e) {
      failed++;
      console.error(`✗ ${entry.file}: ${e.message}`);
    }
  }

  console.log(`\nListo. Generadas: ${ok} · Omitidas: ${skipped} · Fallidas: ${failed}`);
  if (ok > 0) {
    console.log("Siguiente paso: node scripts/apply-image-manifest.mjs");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
