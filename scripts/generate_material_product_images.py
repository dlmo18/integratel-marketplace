#!/usr/bin/env python3
"""
Regenera TODAS las imágenes de producto de frontend-public como JPG.

Lee frontend-public/data/products.json, y por cada referencia de imagen de cada
producto genera una foto y la guarda como .jpg en
frontend-public/public/img/products/. Opcionalmente reescribe el JSON para que
todas las rutas usen .jpg.

Proveedores (motor de imágenes):
  - local  : Stable Diffusion local vía 'diffusers' (SIN clave de API).
             Por defecto usa SD 1.5 (runwayml/stable-diffusion-v1-5), que es
             mucho más ligero que SDXL y tolerable en CPU.
  - openai : API de OpenAI (gpt-image-1). Requiere OPENAI_API_KEY / AI_API_KEY.

El prompt se construye a partir del nombre, marca, categoría y descripción del
producto. La vista con índice > 0 se trata como vista alternativa/de detalle.

Uso:
    # Prueba de 1 imagen con Stable Diffusion local (SD 1.5), midiendo tiempo:
    .venv/bin/python scripts/generate_material_product_images.py \
        --provider local --only prod-013 --time

    # Generar todo con SD 1.5 local y actualizar el JSON a .jpg:
    .venv/bin/python scripts/generate_material_product_images.py \
        --provider local --update-json

Variables de entorno útiles (SD local):
    SD_LOCAL_MODEL  modelo HF (def. runwayml/stable-diffusion-v1-5)
    SD_STEPS        pasos de inferencia (def. 25)
    SD_GUIDANCE     guidance scale (def. 7.5)
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import time
from io import BytesIO
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
# frontend-public reemplazó a frontend-material.
FRONTEND_DIR = REPO_ROOT / "frontend-public"
PRODUCTS_JSON = FRONTEND_DIR / "data" / "products.json"
PUBLIC_DIR = FRONTEND_DIR / "public"
PRODUCTS_IMG_DIR = PUBLIC_DIR / "img" / "products"

OPENAI_MODEL = "gpt-image-1"

# SD 1.5: ligero y razonable en CPU. Se puede sobreescribir con SD_LOCAL_MODEL.
# El repo original 'runwayml/stable-diffusion-v1-5' fue retirado del Hub; usamos
# un espejo mantenido con los mismos pesos.
SD_LOCAL_MODEL = os.environ.get(
    "SD_LOCAL_MODEL", "stable-diffusion-v1-5/stable-diffusion-v1-5"
)

STYLE = (
    "estilo fotografía de producto para e-commerce, fondo blanco limpio y neutro, "
    "iluminación de estudio suave, enfoque nítido, alta resolución, "
    "sin texto, sin logos de marca, sin marcas de agua"
)

NEGATIVE_PROMPT = (
    "texto, letras, marca de agua, logo, firma, baja calidad, borroso, "
    "deforme, recortado, ruido, jpeg artifacts, manos deformes"
)

ENV_FILES = [
    REPO_ROOT / "backend" / ".env",
    FRONTEND_DIR / ".env.local",
    FRONTEND_DIR / ".env",
]


def eprint(*args) -> None:
    print(*args, file=sys.stderr, flush=True)


def _parse_env_file(path: Path) -> dict:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        if key.startswith("export "):
            key = key[len("export "):].strip()
        val = val.strip().strip('"').strip("'")
        if key:
            values[key] = val
    return values


def resolve_api_key(*names: str) -> str | None:
    for name in names:
        if os.environ.get(name):
            return os.environ[name]
    for env_path in ENV_FILES:
        parsed = _parse_env_file(env_path)
        for name in names:
            if parsed.get(name):
                eprint(f"  (clave {name} tomada de {env_path})")
                return parsed[name]
    return None


def build_prompt(product: dict, index: int) -> str:
    name = product.get("name", "")
    brand = product.get("brand", "")
    category = product.get("category", "")
    short = product.get("shortDescription", "")
    view = (
        "vista frontal principal, producto centrado"
        if index == 0
        else "vista alternativa en ángulo mostrando detalles"
    )
    detail = f" Detalle: {short}" if short else ""
    return (
        f'Foto de producto de "{name}" de la marca {brand}, '
        f"categoría {category}, {view}.{detail} {STYLE}."
    )


def save_jpg(image_bytes: bytes, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        from PIL import Image

        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        img = img.resize((800, 800), Image.LANCZOS)
        img.save(dest, format="JPEG", quality=88)
    except ImportError:
        dest.write_bytes(image_bytes)


# ---------------------------------------------------------------------------
# Proveedores
# ---------------------------------------------------------------------------
class OpenAIImage:
    name = "openai"

    def __init__(self) -> None:
        key = resolve_api_key("OPENAI_API_KEY", "AI_API_KEY")
        if not key:
            eprint("✗ No se encontró OPENAI_API_KEY / AI_API_KEY.")
            sys.exit(1)
        from openai import OpenAI

        self._client = OpenAI(api_key=key)

    def generate(self, prompt: str) -> bytes:
        result = self._client.images.generate(
            model=OPENAI_MODEL, prompt=prompt, size="1024x1024", n=1
        )
        return base64.b64decode(result.data[0].b64_json)


class LocalStableDiffusion:
    """Stable Diffusion local con 'diffusers' (sin clave de API).

    Detecta CUDA / MPS / CPU. En CPU usa float32. El modelo se carga una sola
    vez (perezosamente) y se reutiliza para todas las imágenes.
    """

    name = "local"

    def __init__(self) -> None:
        try:
            import torch  # noqa: F401
            from diffusers import StableDiffusionPipeline  # noqa: F401
        except ImportError:
            eprint("✗ Faltan paquetes para Stable Diffusion local.")
            eprint("  Instálalos con:")
            eprint("  .venv/bin/pip install torch diffusers transformers accelerate safetensors")
            sys.exit(1)
        self._pipe = None

    def _device_and_dtype(self):
        import torch

        if torch.cuda.is_available():
            return "cuda", torch.float16
        if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
            return "mps", torch.float32
        return "cpu", torch.float32

    def _ensure_pipe(self):
        if self._pipe is not None:
            return
        import torch
        from diffusers import StableDiffusionPipeline

        device, dtype = self._device_and_dtype()
        eprint(f"→ Cargando modelo local '{SD_LOCAL_MODEL}' en {device} (puede tardar la 1ª vez)…")
        pipe = StableDiffusionPipeline.from_pretrained(
            SD_LOCAL_MODEL,
            torch_dtype=dtype,
            safety_checker=None,  # evita descargas/latencia extra del filtro
        )
        pipe = pipe.to(device)
        pipe.set_progress_bar_config(disable=False)
        if device == "cuda":
            pipe.enable_attention_slicing()
        self._pipe = pipe
        self._device = device

    def generate(self, prompt: str) -> bytes:
        import torch

        self._ensure_pipe()
        steps = int(os.environ.get("SD_STEPS", "25"))
        guidance = float(os.environ.get("SD_GUIDANCE", "7.5"))
        with torch.inference_mode():
            image = self._pipe(
                prompt=prompt,
                negative_prompt=NEGATIVE_PROMPT,
                num_inference_steps=steps,
                guidance_scale=guidance,
                width=512,
                height=512,
            ).images[0]
        buf = BytesIO()
        image.save(buf, format="PNG")
        return buf.getvalue()


PROVIDERS = {"local": LocalStableDiffusion, "openai": OpenAIImage}


def iter_image_refs(products: list[dict]):
    for product in products:
        for index, rel in enumerate(product.get("images", [])):
            yield product, index, rel


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--provider", choices=list(PROVIDERS.keys()), default="local",
        help="Motor de imágenes (def. local = Stable Diffusion sin API).",
    )
    parser.add_argument("--only", help="Solo este id de producto (ej. prod-013).")
    parser.add_argument("--limit", type=int, help="Máximo de imágenes a generar.")
    parser.add_argument("--dry-run", action="store_true", help="No genera, solo lista.")
    parser.add_argument("--time", action="store_true", help="Mide el tiempo por imagen.")
    parser.add_argument(
        "--update-json", action="store_true",
        help="Reescribe products.json con rutas .jpg al terminar.",
    )
    args = parser.parse_args()

    if not PRODUCTS_JSON.exists():
        eprint(f"✗ No existe {PRODUCTS_JSON}")
        sys.exit(1)

    products = json.loads(PRODUCTS_JSON.read_text(encoding="utf-8"))
    refs = list(iter_image_refs(products))
    if args.only:
        refs = [r for r in refs if r[0].get("id") == args.only]
    if args.limit:
        refs = refs[: args.limit]

    total = len(refs)
    eprint(f"• {total} imágenes a procesar | proveedor {args.provider}")

    provider = None if args.dry_run else PROVIDERS[args.provider]()

    done = failed = 0
    t_first = None
    for i, (product, index, rel) in enumerate(refs, start=1):
        stem = f"{product['id']}-{index}"
        dest = PRODUCTS_IMG_DIR / f"{stem}.jpg"
        prompt = build_prompt(product, index)
        label = f"[{i}/{total}] {stem}"

        if args.dry_run:
            eprint(f"→ {label} (dry-run) {prompt[:90]}…")
            continue

        try:
            eprint(f"→ {label} generando…")
            t0 = time.time()
            image_bytes = provider.generate(prompt)
            save_jpg(image_bytes, dest)
            dt = time.time() - t0
            if t_first is None:
                t_first = dt
            done += 1
            extra = f" ({dt:.1f}s)" if args.time else ""
            eprint(f"  ✓ {dest.relative_to(FRONTEND_DIR)}{extra}")
        except Exception as exc:  # noqa: BLE001
            failed += 1
            eprint(f"  ✗ error {stem}: {type(exc).__name__}: {str(exc)[:200]}")

    if args.update_json and not args.dry_run:
        changed = 0
        for product in products:
            new_imgs = []
            for index, _rel in enumerate(product.get("images", [])):
                new_rel = f"/img/products/{product['id']}-{index}.jpg"
                if new_rel != _rel:
                    changed += 1
                new_imgs.append(new_rel)
            product["images"] = new_imgs
        PRODUCTS_JSON.write_text(
            json.dumps(products, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        eprint(f"• products.json actualizado ({changed} rutas cambiadas).")

    eprint("")
    eprint(f"Resumen: {done} generadas, {failed} con error, de {total}.")
    if args.time and t_first is not None:
        eprint(f"Tiempo 1ª imagen (incluye carga de modelo): {t_first:.1f}s")


if __name__ == "__main__":
    main()
