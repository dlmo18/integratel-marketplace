#!/usr/bin/env python3
"""
Genera imágenes a partir de texto leyendo el manifiesto docs/image-manifest.json.

Soporta tres proveedores (motores de imágenes):
  - openai     : API de OpenAI, modelo gpt-image-1 (el motor detrás de DALL·E).
  - stability  : API de Stability AI (Stable Diffusion en la nube, sin GPU propia).
  - local      : Stable Diffusion local vía 'diffusers' de Hugging Face (sin costo
                 por imagen; usa tu CPU/GPU/Apple Silicon).

Cada entrada del manifiesto tiene un "prompt" (texto) y un "file" (ruta destino
dentro de frontend-public/public/). El script envía el prompt al motor elegido,
recibe la imagen y la guarda como .jpg en la ruta indicada.

Selección de proveedor
-----------------------
Por defecto se autodetecta en este orden:
  1. --provider en la línea de comandos (si se pasa)
  2. OPENAI_API_KEY presente    -> openai
  3. STABILITY_API_KEY presente -> stability
  4. en otro caso               -> local (Stable Diffusion con diffusers)

Uso rápido
----------
    pip install -r requirements.txt

    # OpenAI (DALL·E / gpt-image-1)
    export OPENAI_API_KEY="sk-..."
    python scripts/generate_ai_images.py

    # Stability AI (Stable Diffusion en la nube)
    export STABILITY_API_KEY="sk-..."
    python scripts/generate_ai_images.py --provider stability

    # Stable Diffusion local (requiere torch + diffusers)
    python scripts/generate_ai_images.py --provider local

    # Un grupo concreto / forzar regeneración
    python scripts/generate_ai_images.py --only product --force

    # Imagen única a partir de un texto suelto (sin manifiesto)
    python scripts/generate_ai_images.py --prompt "Un gato astronauta" --out public/img/test.jpg
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
from io import BytesIO
from pathlib import Path

# ----------------------------------------------------------------------------
# Rutas base (relativas a frontend-public/, que es el directorio del proyecto)
# ----------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent          # scripts
REPO_ROOT = SCRIPT_DIR.parent                        # integratel-marketplace
FRONTEND_DIR = REPO_ROOT / "frontend-public"                      # frontend-public
MANIFEST_PATH = REPO_ROOT / "docs" / "image-manifest.json"
PUBLIC_DIR = FRONTEND_DIR / "public"                   # destino de las imágenes

OPENAI_MODEL = "gpt-image-1"  # motor de imágenes de OpenAI (DALL·E)

# Stability AI
STABILITY_HOST = "https://api.stability.ai"
STABILITY_ENDPOINT = "/v2beta/stable-image/generate/core"

# Stable Diffusion local (diffusers). Puedes sobreescribir con SD_LOCAL_MODEL.
SD_LOCAL_MODEL = os.environ.get(
    "SD_LOCAL_MODEL", "stabilityai/stable-diffusion-xl-base-1.0"
)

# Prompt negativo compartido para los motores Stable Diffusion: ayuda a limpiar
# artefactos y a respetar el estilo "e-commerce fondo neutro" del manifiesto.
DEFAULT_NEGATIVE_PROMPT = (
    "texto, letras, marca de agua, logo, firma, baja calidad, borroso, "
    "deforme, recortado, ruido, jpeg artifacts"
)


def eprint(*args) -> None:
    """Imprime en stderr para no mezclar con la salida normal."""
    print(*args, file=sys.stderr)


def load_manifest() -> dict:
    if not MANIFEST_PATH.exists():
        eprint(f"✗ No se encontró el manifiesto: {MANIFEST_PATH}")
        sys.exit(1)
    with MANIFEST_PATH.open(encoding="utf-8") as fh:
        return json.load(fh)


# Archivos .env de los que intentamos leer la clave, en orden de preferencia.
ENV_FILES = [
    REPO_ROOT / "backend" / ".env",
    FRONTEND_DIR / ".env.local",
    FRONTEND_DIR / ".env",
]


def _parse_env_file(path: Path) -> dict:
    """Lee pares CLAVE=valor de un archivo .env (ignora comentarios/vacíos)."""
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        # Quita 'export ' inicial si lo hubiera y comillas envolventes.
        if key.startswith("export "):
            key = key[len("export "):].strip()
        val = val.strip().strip('"').strip("'")
        if key:
            values[key] = val
    return values


def resolve_api_key(*names: str) -> str | None:
    """Busca una clave primero en el entorno y luego en los archivos .env.

    Acepta varios nombres posibles (p.ej. OPENAI_API_KEY o AI_API_KEY) y
    devuelve el primer valor no vacío encontrado.
    """
    for name in names:
        val = os.environ.get(name)
        if val:
            return val
    for env_path in ENV_FILES:
        parsed = _parse_env_file(env_path)
        for name in names:
            if parsed.get(name):
                eprint(f"  (clave {name} tomada de {env_path})")
                return parsed[name]
    return None


def save_jpg(image_bytes: bytes, dest: Path, width: int, height: int) -> None:
    """
    Guarda los bytes como .jpg. Si Pillow está instalado, redimensiona al
    tamaño exacto pedido en el manifiesto; si no, guarda tal cual.
    """
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        from PIL import Image  # opcional

        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        if width and height:
            img = img.resize((width, height), Image.LANCZOS)
        img.save(dest, format="JPEG", quality=90)
    except ImportError:
        # Sin Pillow: guardamos los bytes crudos.
        dest.write_bytes(image_bytes)


# ============================================================================
# Proveedores. Cada uno implementa .generate(prompt, width, height) -> bytes
# ============================================================================
class OpenAIProvider:
    name = "openai"

    def __init__(self) -> None:
        # Acepta OPENAI_API_KEY o AI_API_KEY, desde el entorno o backend/.env.
        api_key = resolve_api_key("OPENAI_API_KEY", "AI_API_KEY")
        if not api_key:
            eprint("✗ No se encontró la clave de OpenAI.")
            eprint("  Define OPENAI_API_KEY (o AI_API_KEY) en el entorno")
            eprint("  o en backend/.env.")
            sys.exit(1)
        try:
            from openai import OpenAI
        except ImportError:
            eprint("✗ Falta el paquete 'openai'. Instálalo con:")
            eprint("  pip install -r requirements.txt")
            sys.exit(1)
        self._client = OpenAI(api_key=api_key)

    @staticmethod
    def _pick_size(width: int, height: int) -> str:
        # gpt-image-1 solo acepta tamaños fijos; elegimos por relación de aspecto.
        if width == height:
            return "1024x1024"
        return "1536x1024" if width > height else "1024x1536"

    def generate(self, prompt: str, width: int, height: int) -> bytes:
        result = self._client.images.generate(
            model=OPENAI_MODEL,
            prompt=prompt,
            size=self._pick_size(width, height),
            n=1,
        )
        return base64.b64decode(result.data[0].b64_json)


class StabilityProvider:
    """Stable Diffusion vía la API en la nube de Stability AI."""

    name = "stability"

    def __init__(self) -> None:
        self._api_key = resolve_api_key("STABILITY_API_KEY")
        if not self._api_key:
            eprint("✗ No se encontró STABILITY_API_KEY (entorno o backend/.env).")
            eprint('  export STABILITY_API_KEY="sk-..."')
            eprint("  (consíguela en https://platform.stability.ai/account/keys)")
            sys.exit(1)
        try:
            import requests  # noqa: F401
        except ImportError:
            eprint("✗ Falta el paquete 'requests'. Instálalo con:")
            eprint("  pip install -r requirements.txt")
            sys.exit(1)

    @staticmethod
    def _aspect_ratio(width: int, height: int) -> str:
        # La API Core acepta aspect_ratio en vez de tamaño exacto.
        if width == height:
            return "1:1"
        return "3:2" if width > height else "2:3"

    def generate(self, prompt: str, width: int, height: int) -> bytes:
        import requests

        resp = requests.post(
            f"{STABILITY_HOST}{STABILITY_ENDPOINT}",
            headers={
                "authorization": f"Bearer {self._api_key}",
                # 'image/*' -> devuelve los bytes de la imagen directamente.
                "accept": "image/*",
            },
            files={"none": ""},  # fuerza multipart/form-data que exige la API
            data={
                "prompt": prompt,
                "negative_prompt": DEFAULT_NEGATIVE_PROMPT,
                "aspect_ratio": self._aspect_ratio(width, height),
                "output_format": "jpeg",
            },
            timeout=120,
        )
        if resp.status_code != 200:
            # El cuerpo suele traer un JSON con el detalle del error.
            raise RuntimeError(f"Stability API {resp.status_code}: {resp.text}")
        return resp.content


class LocalStableDiffusionProvider:
    """Stable Diffusion local con 'diffusers' de Hugging Face.

    El modelo se carga una sola vez (perezosamente) y se reutiliza para todas
    las imágenes. Detecta automáticamente CUDA (NVIDIA), MPS (Apple Silicon)
    o CPU como último recurso.
    """

    name = "local"

    def __init__(self) -> None:
        try:
            import torch  # noqa: F401
            from diffusers import AutoPipelineForText2Image  # noqa: F401
        except ImportError:
            eprint("✗ Faltan paquetes para Stable Diffusion local.")
            eprint("  Instálalos (son pesados) con:")
            eprint("  pip install torch diffusers transformers accelerate safetensors")
            sys.exit(1)
        self._pipe = None  # se carga en el primer uso

    def _device_and_dtype(self):
        import torch

        if torch.cuda.is_available():
            return "cuda", torch.float16
        if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
            # Apple Silicon (M1/M2/M3). float32 es más estable en MPS.
            return "mps", torch.float32
        return "cpu", torch.float32

    def _ensure_pipe(self):
        if self._pipe is not None:
            return
        import torch
        from diffusers import AutoPipelineForText2Image

        device, dtype = self._device_and_dtype()
        eprint(f"→ Cargando modelo local '{SD_LOCAL_MODEL}' en {device} (puede tardar)…")
        pipe = AutoPipelineForText2Image.from_pretrained(
            SD_LOCAL_MODEL,
            torch_dtype=dtype,
            use_safetensors=True,
        )
        pipe = pipe.to(device)
        # Ahorra VRAM en GPUs modestas.
        if device == "cuda":
            pipe.enable_attention_slicing()
        self._pipe = pipe
        self._device = device

    @staticmethod
    def _round_to_8(value: int) -> int:
        # Stable Diffusion exige dimensiones múltiplo de 8.
        return max(8, (value // 8) * 8)

    def generate(self, prompt: str, width: int, height: int) -> bytes:
        import torch

        self._ensure_pipe()
        # SDXL rinde mejor cerca de 1024px; limitamos para no agotar memoria.
        gen_w = self._round_to_8(min(width or 1024, 1024))
        gen_h = self._round_to_8(min(height or 1024, 1024))

        kwargs = dict(
            prompt=prompt,
            negative_prompt=DEFAULT_NEGATIVE_PROMPT,
            width=gen_w,
            height=gen_h,
            num_inference_steps=int(os.environ.get("SD_STEPS", "30")),
            guidance_scale=float(os.environ.get("SD_GUIDANCE", "7.0")),
        )
        with torch.inference_mode():
            image = self._pipe(**kwargs).images[0]

        buf = BytesIO()
        image.save(buf, format="PNG")
        return buf.getvalue()


PROVIDERS = {
    "openai": OpenAIProvider,
    "stability": StabilityProvider,
    "local": LocalStableDiffusionProvider,
}


def resolve_provider(requested: str | None) -> str:
    """Decide qué proveedor usar según --provider o variables de entorno."""
    if requested:
        return requested
    if os.environ.get("OPENAI_API_KEY"):
        return "openai"
    if os.environ.get("STABILITY_API_KEY"):
        return "stability"
    return "local"


def build_provider(requested: str | None):
    name = resolve_provider(requested)
    eprint(f"• Proveedor de imágenes: {name}")
    return PROVIDERS[name]()


def run_single(provider, prompt: str, out: str) -> None:
    """Genera una sola imagen a partir de un prompt suelto."""
    dest = (FRONTEND_DIR / out).resolve()
    eprint(f"→ Generando imagen única: {dest}")
    image_bytes = provider.generate(prompt, 1024, 1024)
    save_jpg(image_bytes, dest, 1024, 1024)
    print(f"✓ Imagen guardada en {dest}")


def run_manifest(provider, only: str | None, force: bool) -> None:
    manifest = load_manifest()
    images = manifest.get("images", [])

    if only:
        images = [img for img in images if img.get("group") == only]

    if not images:
        eprint("No hay imágenes que procesar con esos filtros.")
        return

    total = len(images)
    done = 0
    skipped = 0
    failed = 0

    for i, entry in enumerate(images, start=1):
        rel_file = entry["file"]                       # ej. img/products/prod-001-0.jpg
        dest = PUBLIC_DIR / rel_file
        prompt = entry["prompt"]
        width = entry.get("width", 1024)
        height = entry.get("height", 1024)

        label = f"[{i}/{total}] {entry.get('id', rel_file)}"

        if dest.exists() and not force:
            skipped += 1
            eprint(f"• {label} ya existe, se omite (usa --force para regenerar)")
            continue

        try:
            eprint(f"→ {label} generando…")
            image_bytes = provider.generate(prompt, width, height)
            save_jpg(image_bytes, dest, width, height)
            done += 1
            eprint(f"  ✓ guardada en public/{rel_file}")
        except Exception as exc:  # noqa: BLE001 - queremos continuar con el resto
            failed += 1
            eprint(f"  ✗ error con {entry.get('id', rel_file)}: {exc}")

    eprint("")
    eprint(f"Resumen: {done} generadas, {skipped} omitidas, {failed} con error.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Genera imágenes desde texto con OpenAI (DALL·E), "
        "Stability AI o Stable Diffusion local.",
    )
    parser.add_argument(
        "--provider",
        choices=list(PROVIDERS.keys()),
        help="Fuerza el motor de imágenes. Por defecto se autodetecta.",
    )
    parser.add_argument(
        "--only",
        choices=["category", "product", "banner", "avatar"],
        help="Procesa solo un grupo del manifiesto.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Regenera aunque el archivo ya exista.",
    )
    parser.add_argument(
        "--prompt",
        help="Genera una sola imagen a partir de este texto (ignora el manifiesto).",
    )
    parser.add_argument(
        "--out",
        default="public/img/generated.jpg",
        help="Ruta destino (relativa a frontend-public/) para --prompt.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    provider = build_provider(args.provider)
    if args.prompt:
        run_single(provider, args.prompt, args.out)
    else:
        run_manifest(provider, args.only, args.force)


if __name__ == "__main__":
    main()
