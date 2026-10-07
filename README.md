# Ecommerce

> Proyecto basado en [integratel-marketplace](https://github.com/dlmo18/integratel-marketplace).

Marketplace piloto (demo) inspirado en la línea gráfica y estructura de
[movistar.com.pe](https://www.movistar.com.pe/), pero orientado a **ventas
diversas**: además de equipos Movistar (móviles, accesorios, etc.), permite que
usuarios de tipo **Seller** publiquen productos de otros rubros. El portal es el
motor de ventas: los clientes compran y los sellers hacen seguimiento a sus
transacciones.

> Este es un **proyecto piloto / demostración**. La base de datos son archivos
> **JSON estáticos** con información de demo para navegar toda la experiencia sin
> backend real.

---

## Alcance del sistema

### Aplicaciones

| Carpeta            | Descripción                                                     | Puerto |
| ------------------ | --------------------------------------------------------------- | ------ |
| `frontend-public`  | Sitio público del marketplace (Next.js App Router)              | 3000   |
| `frontend-manager` | Panel de administración (Next.js) — **solo login**              | 3001   |
| `backend`          | API NestJS — agente de ventas IA (OpenAI), protege la API key   | 3002   |
| raíz (`/`)         | Orquestador con `concurrently` para arrancar los tres servicios | —      |

> Los datos del catálogo se sirven desde JSON estáticos en el frontend. El
> `backend` (NestJS) se usa para el **agente de ventas con IA**: mantiene la clave
> de OpenAI y los prompts del lado del servidor, de modo que nunca se exponen al
> navegador.

### Stack

- **Next.js 14** (App Router, React 18)
- **Tailwind CSS** con paleta inspirada en Movistar (azul `#019DF4`, navy `#00337A`, verde `#5CB615`)
- **JSON estáticos** como fuente de datos (`frontend-public/data/`)
- **concurrently** para sincronizar el arranque de ambos frontends

### Árbol de la parte pública implementado

- **Home** (`/`): hero banner, galería de productos destacados, CTA a más
  vendidos y promociones, galería de acceso directo a categorías y CTA para ser Seller.
- **Catálogo** (`/catalogo`): filtros por categoría, marca, proveedor, precio,
  búsqueda y ordenamiento.
- **Detalle de producto** (`/producto/[slug]`): galería, stock, agregar al carrito y relacionados.
- **Giftcards** (`/giftcards`): compra de tarjetas de regalo que generan un
  código de voucher canjeable en el carrito.
- **Checkout**
  - Carrito de compra (`/checkout/carrito`) — admite códigos de voucher y giftcard.
  - Proceso de pago (`/checkout/pago`): **envío** (transportista: Serpost, Olva,
    DHL, Urbano + dirección guardada o nueva) y **pagos asociados** (cobro
    compartido: billeteras, tarjeta, depósito, cashback, crédito).
- **Nosotros** (contenido lorem ipsum)
  - Acerca de (`/nosotros/acerca-de`)
  - Términos y condiciones (`/nosotros/terminos`)
  - Políticas de privacidad (`/nosotros/privacidad`)
  - Políticas de Sellers (`/nosotros/sellers`)
- **Soporte** (formularios)
  - Contáctanos (`/soporte/contactanos`)
  - Cambios y devoluciones (`/soporte/cambios-devoluciones`)
  - Seguimiento de pedidos (`/soporte/seguimiento`) — búsqueda funcional con datos demo
  - Vender en marketplace (`/soporte/vender`)
- **Asistente virtual (agente de ventas IA)**: chat flotante conectado al backend
  NestJS, que consulta a OpenAI. Ayuda a comprar y vender, recomienda productos
  del catálogo y explica pagos, puntos y vouchers. Sin API key funciona en modo
  fallback con respuestas guiadas.
- **Login / Registro**
  - Registrar cuenta (`/registro`)
  - Darse de alta como Seller (`/registro?tipo=seller`)
  - Login (`/login`)
- **Mi Cuenta** (`/cuenta`, protegida por sesión)
  - **Mis Compras**: Dashboard, Historial, Estado de entregas, Estado de devoluciones.
  - **Mis Ventas** (solo Seller): Dashboard, Historial, Gestión de items (stock/precio), Transacciones de pago.
  - **Mis Datos**: Datos personales, Direcciones, Medios de Pago.

### Panel administrador (`frontend-manager`)

- Login del administrador (`/`) y un dashboard mínimo demostrativo (`/dashboard`).

---

## Datos demo

Ubicados en `frontend-public/data/`:

- `categories.json` — categorías diversas, incluye la categoría **Movistar**.
- `products.json` — productos por categoría. Las imágenes son un **banco local** (SVG) en `frontend-public/public/img/`, sin dependencia de servicios externos.
- `users.json` — cuentas demo (comprador y seller), direcciones y medios de pago.
- `orders.json`, `sales.json`, `transactions.json`, `returns.json` — datos de compras, ventas, pagos y devoluciones.

### Credenciales demo

**Sitio público** (`localhost:3000/login`)

| Tipo    | Correo               | Contraseña | Tema de color                     |
| ------- | -------------------- | ---------- | --------------------------------- |
| Regular | `comprador@demo.com` | `demo1234` | Movistar (azul)                   |
| VIP     | `vip@demo.com`       | `demo1234` | Negro / blanco / gris             |
| Seller  | `seller@demo.com`    | `demo1234` | Movistar Empresas (azul profundo) |

**Panel administrador** (`localhost:3001`)

| Rol   | Correo                  | Contraseña  |
| ----- | ----------------------- | ----------- |
| Admin | `admin@integratel.demo` | `admin1234` |

Para probar el **seguimiento de pedidos** usa el código `ORD-2026-0001` o `TRK-889201`.

### Tipos de usuario y temas de color

Cada usuario tiene un `tier` en `users.json` que define su experiencia:

| Tier      | Acceso                                              | Paleta                              |
| --------- | --------------------------------------------------- | ----------------------------------- |
| (sin login) | Solo contenido público. No entra a `/cuenta`.     | Movistar (azul)                     |
| `regular` | `/cuenta` sí; **no** ve "Mis Ventas" (`/cuenta/ventas`). | Movistar (azul)                |
| `vip`     | Igual que regular, con distintivo VIP.              | Negro, blanco y gris                |
| `seller`  | Acceso completo, incluida la sección "Mis Ventas".  | Movistar Empresas (azul profundo/teal) |

- El **tema** se aplica cambiando `data-theme` en `<html>` (regular/vip/seller);
  toda la paleta de Tailwind (`movistar.*`) se resuelve desde CSS variables en
  `app/globals.css`, así que un cambio de tier reestiliza toda la web.
- La sesión (incluido el `tier`) se guarda en **localStorage** al hacer login.
- **Control de acceso**: el layout de `/cuenta` redirige a `/login` si no hay
  sesión; las páginas de `/cuenta/ventas/*` están protegidas y solo las ve un
  `seller`.

---

## Cómo ejecutar

Requisitos: Node.js 20+ y npm.

```bash
# 1. Instalar dependencias de la raíz y de las tres apps
npm run install:all

# 2. Arrancar todo en paralelo (public + manager + backend)
npm run dev
```

> Instalación detallada, variables de entorno y **despliegue con GitHub Actions
> a Google Cloud**: ver [`docs/MANUAL-INSTALACION.md`](docs/MANUAL-INSTALACION.md).

- Sitio público: http://localhost:3000
- Panel administrador: http://localhost:3001

### Otros scripts (raíz)

```bash
npm run build         # build de producción de ambos frontends
npm start             # arranca ambos en modo producción
npm run dev:public    # solo el sitio público
npm run dev:manager   # solo el panel administrador
```

### Banco de imágenes (IA)

Las imágenes de la demo se generan con una IA de imágenes (OpenAI o Gemini) a
partir de un manifiesto declarativo (`docs/image-manifest.json`) y se descargan
a `frontend-public/public/img/`. Sin API key hay un modo fallback que descarga
fotos reales para no bloquear la demo.

```bash
# genera manifiesto + imágenes + actualiza referencias
npm --prefix frontend-public run images

# con IA real:
OPENAI_API_KEY=sk-xxx npm --prefix frontend-public run images:generate
GEMINI_API_KEY=xxx    npm --prefix frontend-public run images:generate
```

Detalle completo del flujo en [`docs/README-imagenes.md`](docs/README-imagenes.md).

### Agente de ventas IA (backend NestJS)

El chat de soporte del sitio público es un **agente de ventas** conectado a un
backend NestJS (`backend/`, puerto 3002) que llama a OpenAI. La clave de API y
los prompts viven en `backend/.env` y **nunca se exponen al frontend**.

Configuración:

1. Copia la plantilla y edita tus valores:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. En `backend/.env` define:
   - `AI_API_KEY` — tu clave real de OpenAI (`sk-...`).
   - `AI_MODEL` — modelo de chat (por defecto `gpt-4o-mini`).
   - `AI_SYSTEM_NAME` — nombre del agente (aparece en el prompt y en la cabecera del chat).
   - `AI_SYSTEM_PROMPT` — personalidad e instrucciones del agente.
   - `AI_GUARDRAILS` — límites de qué puede/está permitido responder.
3. El frontend apunta al backend vía `frontend-public/.env.local`
   (`NEXT_PUBLIC_API_URL=http://localhost:3002/api`).

Endpoints:

- `GET  /api/chat/health` — estado del servicio.
- `GET  /api/chat/config` — configuración pública del agente: `{ "agentName": "..." }` (leído de `AI_SYSTEM_NAME`).
- `POST /api/chat` — body `{ "message": "...", "history": [...] }`, responde `{ "reply": "..." }`.

Sin `AI_API_KEY` válida, el agente responde en **modo fallback** (respuestas
guiadas) para no bloquear la demo.

> Seguridad: `backend/.env` está en `.gitignore`. Nunca subas tu clave al
> repositorio ni la compartas en texto plano.


---

## Estructura del proyecto

```
ecommerce/
├── package.json              # orquestador (concurrently)
├── frontend-public/          # sitio público (Next.js)
│   ├── app/                  # rutas (App Router)
│   ├── components/           # UI compartida
│   ├── context/              # StoreContext (carrito + sesión)
│   ├── data/                 # JSON estáticos (datos demo)
│   └── lib/                  # acceso a datos y formateadores
└── frontend-manager/         # panel administrador (Next.js, solo login)
    └── app/
```

---

## Especificación original

Se requiere desarrollar un marketplace basado en https://www.movistar.com.pe/ a
nivel de estilos y estructura general del portal, pero orientado a venta diversas,
donde no solo se vendan equipos de Movistar (equipos moviles, accesorios, etc)
sino que tambien productos de otros rubros publicados por usuarios de tipo
"Sellers". La idea es que el portal sea el motor de ventas, que los clientes
realicen sus compras y que luego los sellers puedan hacer seguimiento a sus
transacciones.

De momento se requiere que este sea un proyecto piloto por lo que se espera
desarrollar una demo de la parte publica, el procesos de venta, la seccion de
cuentas de clientes y de los Sellers.
