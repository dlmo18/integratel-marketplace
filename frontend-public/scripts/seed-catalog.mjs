// Genera data/products.json con >=10 productos por categoría y crea imágenes
// SVG de marcador de posición para cada producto en public/img/products.
// Mantiene los 12 productos originales (reasignando los que estaban en las
// categorías retiradas "moda" y "belleza") y añade los nuevos.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA = join(ROOT, "data");
const PRODUCTS_FILE = join(DATA, "products.json");
const IMG_DIR = join(ROOT, "public", "img", "products");

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Paleta por categoría para las imágenes SVG.
const palette = {
  movistar: ["#019DF4", "#00337A"],
  tecnologia: ["#6366f1", "#1e1b4b"],
  hogar: ["#0ea5e9", "#0c4a6e"],
  "over-the-top": ["#e50914", "#1f1147"],
  deportes: ["#16a34a", "#064e3b"],
  "servicios-digitales": ["#0b4f9c", "#06b6d4"],
  juguetes: ["#f59e0b", "#b45309"]
};

// --- Catálogo base original (12 productos) reutilizado tal cual, salvo las
// categorías retiradas que reasignamos a categorías vigentes. --------------
const original = JSON.parse(readFileSync(PRODUCTS_FILE, "utf8"));

const reassigned = original.map((p) => {
  // prod-008 (polo deportivo Nike) estaba en "moda" -> va a "deportes".
  if (p.id === "prod-008") return { ...p, category: "deportes" };
  // prod-010 (skincare) estaba en "belleza" -> lo reemplazamos por una licencia
  // de software para estrenar la categoría "servicios-digitales".
  if (p.id === "prod-010") {
    return {
      id: "prod-010",
      name: "Microsoft 365 Personal (1 año)",
      slug: "microsoft-365-personal-1-anio",
      category: "servicios-digitales",
      brand: "Microsoft",
      seller: "seller-002",
      provider: "TechStore SAC",
      price: 259,
      listPrice: 299,
      currency: "PEN",
      stock: 999,
      rating: 4.8,
      reviews: 91,
      featured: true,
      bestSeller: true,
      onSale: true,
      images: ["/img/products/prod-010-0.svg"],
      shortDescription:
        "Office completo + 1 TB OneDrive para 1 usuario, 1 año.",
      description:
        "Licencia anual de Microsoft 365 Personal: Word, Excel, PowerPoint, Outlook y 1 TB de almacenamiento en OneDrive. Entrega de clave digital por correo.",
      specs: [
        { label: "Tipo de licencia", value: "Suscripción anual (1 usuario)" },
        { label: "Aplicaciones", value: "Word, Excel, PowerPoint, Outlook, OneNote" },
        { label: "Almacenamiento", value: "1 TB OneDrive" },
        { label: "Dispositivos", value: "PC, Mac, tablet y móvil" },
        { label: "Entrega", value: "Clave digital por correo" },
        { label: "Idioma", value: "Multilenguaje" },
        { label: "Vigencia", value: "12 meses" },
        { label: "Garantía", value: "Reposición de clave si falla" }
      ]
    };
  }
  return p;
});

// --- Generadores de productos nuevos por categoría -------------------------
let counter = 13;
const nextId = () => `prod-${String(counter++).padStart(3, "0")}`;

const make = (data) => {
  const id = nextId();
  const slug = data.slug || slugify(data.name);
  const listPrice = data.listPrice ?? data.price;
  return {
    id,
    name: data.name,
    slug,
    category: data.category,
    brand: data.brand,
    seller: data.seller || "seller-001",
    provider: data.provider || "Integratel Marketplace",
    price: data.price,
    listPrice,
    currency: "PEN",
    stock: data.stock,
    rating: data.rating,
    reviews: data.reviews,
    featured: !!data.featured,
    bestSeller: !!data.bestSeller,
    onSale: listPrice > data.price,
    images: [`/img/products/${id}-0.svg`],
    shortDescription: data.shortDescription,
    description: data.description,
    specs: data.specs
  };
};

const spec = (label, value) => ({ label, value });

// Specs genéricas para suscripciones OTT.
const ottSpecs = (extra = []) => [
  spec("Tipo", "Suscripción digital"),
  spec("Entrega", "Código / activación por correo"),
  spec("Dispositivos", "Smart TV, móvil, web y consola"),
  ...extra,
  spec("Renovación", "Mensual (cancelable)"),
  spec("Soporte", "Chat 24/7"),
  spec("Garantía", "Reposición de código si falla")
];

// Specs genéricas para licencias de software.
const swSpecs = (extra = []) => [
  spec("Tipo de licencia", "Clave digital"),
  spec("Entrega", "Clave por correo electrónico"),
  spec("Plataforma", "Windows / macOS"),
  ...extra,
  spec("Activación", "En línea, inmediata"),
  spec("Soporte", "Centro de ayuda del fabricante"),
  spec("Garantía", "Reposición de clave si falla")
];

const newProducts = [
  // ===================== OVER-THE-TOP (10) ==============================
  make({ category: "over-the-top", brand: "Netflix", name: "Netflix Plan Premium 4K (1 mes)", price: 44.9, listPrice: 44.9, stock: 999, rating: 4.8, reviews: 320, featured: true, bestSeller: true, provider: "Integratel Digital", shortDescription: "4K UHD, 4 pantallas simultáneas.", description: "Suscripción mensual a Netflix Premium: calidad 4K Ultra HD, HDR y hasta 4 dispositivos a la vez.", specs: ottSpecs([spec("Calidad", "4K UHD + HDR"), spec("Pantallas simultáneas", "4")]) }),
  make({ category: "over-the-top", brand: "Netflix", name: "Netflix Plan Estándar (1 mes)", price: 34.9, listPrice: 34.9, stock: 999, rating: 4.6, reviews: 210, bestSeller: true, provider: "Integratel Digital", shortDescription: "Full HD, 2 pantallas simultáneas.", description: "Suscripción mensual a Netflix Estándar: Full HD y hasta 2 dispositivos simultáneos.", specs: ottSpecs([spec("Calidad", "1080p Full HD"), spec("Pantallas simultáneas", "2")]) }),
  make({ category: "over-the-top", brand: "Disney+", name: "Disney+ Estándar (1 mes)", price: 28.9, listPrice: 32.9, stock: 999, rating: 4.7, reviews: 185, featured: true, provider: "Integratel Digital", shortDescription: "Disney, Pixar, Marvel y Star Wars.", description: "Suscripción mensual a Disney+ con todo el catálogo de Disney, Pixar, Marvel, Star Wars y National Geographic.", specs: ottSpecs([spec("Calidad", "Full HD"), spec("Pantallas simultáneas", "2")]) }),
  make({ category: "over-the-top", brand: "Amazon", name: "Prime Video (1 mes)", price: 19.9, listPrice: 24.9, stock: 999, rating: 4.5, reviews: 160, bestSeller: true, provider: "Integratel Digital", shortDescription: "Series y películas Amazon Originals.", description: "Suscripción mensual a Amazon Prime Video con contenido Originals y estrenos exclusivos.", specs: ottSpecs([spec("Calidad", "4K UHD"), spec("Pantallas simultáneas", "3")]) }),
  make({ category: "over-the-top", brand: "HBO Max", name: "Max Estándar (1 mes)", price: 29.9, listPrice: 34.9, stock: 999, rating: 4.6, reviews: 140, featured: true, provider: "Integratel Digital", shortDescription: "HBO, Warner, DC y más.", description: "Suscripción mensual a Max (HBO) con series de HBO, estrenos de Warner y el universo DC.", specs: ottSpecs([spec("Calidad", "Full HD"), spec("Pantallas simultáneas", "2")]) }),
  make({ category: "over-the-top", brand: "Spotify", name: "Spotify Premium Individual (1 mes)", price: 19.9, listPrice: 19.9, stock: 999, rating: 4.8, reviews: 410, bestSeller: true, provider: "Integratel Digital", shortDescription: "Música sin anuncios, descargas offline.", description: "Suscripción mensual a Spotify Premium: música sin anuncios, saltos ilimitados y escucha sin conexión.", specs: ottSpecs([spec("Calidad de audio", "Hasta 320 kbps"), spec("Modo offline", "Sí")]) }),
  make({ category: "over-the-top", brand: "YouTube", name: "YouTube Premium (1 mes)", price: 23.9, listPrice: 26.9, stock: 999, rating: 4.5, reviews: 175, provider: "Integratel Digital", shortDescription: "Sin anuncios + YouTube Music.", description: "Suscripción mensual a YouTube Premium: videos sin anuncios, reproducción en segundo plano y YouTube Music incluido.", specs: ottSpecs([spec("Reproducción en segundo plano", "Sí"), spec("Incluye", "YouTube Music")]) }),
  make({ category: "over-the-top", brand: "Apple", name: "Apple TV+ (1 mes)", price: 24.9, listPrice: 24.9, stock: 999, rating: 4.4, reviews: 95, provider: "Integratel Digital", shortDescription: "Apple Originals en 4K Dolby Vision.", description: "Suscripción mensual a Apple TV+ con producciones originales en 4K Dolby Vision y audio espacial.", specs: ottSpecs([spec("Calidad", "4K Dolby Vision"), spec("Pantallas simultáneas", "6")]) }),
  make({ category: "over-the-top", brand: "Paramount+", name: "Paramount+ (1 mes)", price: 18.9, listPrice: 22.9, stock: 999, rating: 4.3, reviews: 70, provider: "Integratel Digital", shortDescription: "Películas, series y deportes.", description: "Suscripción mensual a Paramount+ con estrenos de cine, series exclusivas y eventos en vivo.", specs: ottSpecs([spec("Calidad", "Full HD"), spec("Pantallas simultáneas", "3")]) }),
  make({ category: "over-the-top", brand: "Crunchyroll", name: "Crunchyroll Mega Fan (1 mes)", price: 21.9, listPrice: 25.9, stock: 999, rating: 4.6, reviews: 130, featured: true, provider: "Integratel Digital", shortDescription: "Anime sin anuncios, simulcast.", description: "Suscripción mensual a Crunchyroll Mega Fan: catálogo de anime sin anuncios y estrenos simultáneos con Japón.", specs: ottSpecs([spec("Pantallas simultáneas", "4"), spec("Simulcast", "Sí")]) }),

  // ===================== SERVICIOS DIGITALES (software) =================
  // prod-010 ya cubre Microsoft 365 Personal; agregamos 9 para llegar a 10.
  make({ category: "servicios-digitales", brand: "Microsoft", name: "Office 2021 Hogar y Estudiantes", price: 419, listPrice: 499, stock: 500, rating: 4.7, reviews: 120, featured: true, bestSeller: true, provider: "TechStore SAC", seller: "seller-002", shortDescription: "Licencia perpetua: Word, Excel y PowerPoint.", description: "Licencia perpetua de Office 2021 Hogar y Estudiantes para 1 PC o Mac. Incluye Word, Excel y PowerPoint.", specs: swSpecs([spec("Aplicaciones", "Word, Excel, PowerPoint"), spec("Vigencia", "Perpetua (1 equipo)")]) }),
  make({ category: "servicios-digitales", brand: "Microsoft", name: "Windows 11 Pro", price: 329, listPrice: 399, stock: 500, rating: 4.6, reviews: 98, bestSeller: true, provider: "TechStore SAC", seller: "seller-002", shortDescription: "Clave de activación Windows 11 Pro.", description: "Licencia digital de Windows 11 Pro para 1 equipo. Activación en línea con cuenta de Microsoft.", specs: swSpecs([spec("Edición", "Pro"), spec("Vigencia", "Perpetua (1 equipo)")]) }),
  make({ category: "servicios-digitales", brand: "Adobe", name: "Adobe Creative Cloud (1 año)", price: 1899, listPrice: 2199, stock: 300, rating: 4.8, reviews: 210, featured: true, bestSeller: true, provider: "Integratel Digital", shortDescription: "Suite completa: Photoshop, Illustrator, Premiere.", description: "Suscripción anual a Adobe Creative Cloud con todas las apps: Photoshop, Illustrator, Premiere Pro, After Effects y más.", specs: swSpecs([spec("Apps incluidas", "20+ aplicaciones Adobe"), spec("Almacenamiento", "100 GB en la nube"), spec("Vigencia", "12 meses")]) }),
  make({ category: "servicios-digitales", brand: "Adobe", name: "Adobe Photoshop (1 año)", price: 899, listPrice: 999, stock: 300, rating: 4.7, reviews: 150, provider: "Integratel Digital", shortDescription: "Edición de imagen profesional, 1 usuario.", description: "Suscripción anual a Adobe Photoshop para edición de imagen profesional. Incluye Lightroom y 20 GB en la nube.", specs: swSpecs([spec("Incluye", "Photoshop + Lightroom"), spec("Almacenamiento", "20 GB"), spec("Vigencia", "12 meses")]) }),
  make({ category: "servicios-digitales", brand: "NordVPN", name: "NordVPN Premium (1 año)", price: 199, listPrice: 299, stock: 800, rating: 4.6, reviews: 175, featured: true, provider: "Integratel Digital", shortDescription: "VPN segura para 6 dispositivos.", description: "Suscripción anual a NordVPN: navegación privada, cifrado de nivel bancario y hasta 6 dispositivos.", specs: swSpecs([spec("Dispositivos", "6 simultáneos"), spec("Servidores", "5000+ en 60 países"), spec("Vigencia", "12 meses")]) }),
  make({ category: "servicios-digitales", brand: "Kaspersky", name: "Kaspersky Total Security (1 año, 3 disp.)", price: 149, listPrice: 199, stock: 800, rating: 4.5, reviews: 110, provider: "TechStore SAC", seller: "seller-002", shortDescription: "Antivirus completo para 3 dispositivos.", description: "Licencia anual de Kaspersky Total Security para 3 dispositivos: antivirus, firewall, VPN y gestor de contraseñas.", specs: swSpecs([spec("Dispositivos", "3"), spec("Incluye", "Antivirus, VPN, gestor de contraseñas"), spec("Vigencia", "12 meses")]) }),
  make({ category: "servicios-digitales", brand: "Bitdefender", name: "Bitdefender Total Security (1 año, 5 disp.)", price: 179, listPrice: 229, stock: 800, rating: 4.6, reviews: 95, bestSeller: true, provider: "TechStore SAC", seller: "seller-002", shortDescription: "Protección total para 5 dispositivos.", description: "Licencia anual de Bitdefender Total Security para 5 dispositivos con protección multicapa contra ransomware.", specs: swSpecs([spec("Dispositivos", "5"), spec("Plataforma", "Windows, macOS, Android, iOS"), spec("Vigencia", "12 meses")]) }),
  make({ category: "servicios-digitales", brand: "Google", name: "Google One 200 GB (1 año)", price: 129, listPrice: 149, stock: 900, rating: 4.5, reviews: 80, provider: "Integratel Digital", shortDescription: "200 GB de almacenamiento en la nube.", description: "Suscripción anual a Google One con 200 GB compartidos en Drive, Gmail y Fotos para toda la familia.", specs: swSpecs([spec("Almacenamiento", "200 GB"), spec("Plataforma", "Web, Android, iOS"), spec("Vigencia", "12 meses")]) }),
  make({ category: "servicios-digitales", brand: "Canva", name: "Canva Pro (1 año)", price: 219, listPrice: 269, stock: 900, rating: 4.7, reviews: 160, featured: true, provider: "Integratel Digital", shortDescription: "Diseño con plantillas premium y marca.", description: "Suscripción anual a Canva Pro: plantillas premium, kit de marca, fondo mágico y 1 TB de almacenamiento.", specs: swSpecs([spec("Almacenamiento", "1 TB"), spec("Incluye", "Plantillas premium y Brand Kit"), spec("Vigencia", "12 meses")]) }),

  // ===================== MOVISTAR (6 nuevos -> total 10) ================
  make({ category: "movistar", brand: "Movistar", name: "Plan Postpago Movistar 60GB", price: 69.9, listPrice: 79.9, stock: 999, rating: 4.3, reviews: 140, featured: true, provider: "Movistar Perú", shortDescription: "60GB, llamadas y redes ilimitadas.", description: "Plan postpago mensual con 60GB de datos, llamadas ilimitadas y redes sociales libres.", specs: [spec("Datos", "60 GB"), spec("Llamadas", "Ilimitadas"), spec("Redes sociales", "Libres"), spec("Roaming", "Opcional"), spec("Permanencia", "Sin permanencia"), spec("Garantía", "—")] }),
  make({ category: "movistar", brand: "Samsung", name: "Smartphone Movistar Galaxy S24 5G", price: 3299, listPrice: 3599, stock: 15, rating: 4.8, reviews: 180, featured: true, bestSeller: true, provider: "Movistar Perú", shortDescription: "Galaxy S24 con IA, 256GB, 5G.", description: "Samsung Galaxy S24 5G con Galaxy AI, pantalla Dynamic AMOLED y chip Movistar incluido.", specs: [spec("Pantalla", "6.2\" Dynamic AMOLED 2X"), spec("Procesador", "Exynos 2400"), spec("RAM", "8 GB"), spec("Almacenamiento", "256 GB"), spec("Batería", "4000 mAh"), spec("Conectividad", "5G, Wi-Fi 6E"), spec("Sistema operativo", "Android 14"), spec("Garantía", "12 meses")] }),
  make({ category: "movistar", brand: "Xiaomi", name: "Smartphone Movistar Redmi Note 13", price: 899, listPrice: 1049, stock: 40, rating: 4.4, reviews: 120, bestSeller: true, provider: "Movistar Perú", shortDescription: "AMOLED 120Hz, 256GB, cámara 108MP.", description: "Redmi Note 13 con pantalla AMOLED de 120Hz, cámara de 108MP y chip Movistar.", specs: [spec("Pantalla", "6.67\" AMOLED 120Hz"), spec("Procesador", "Snapdragon 685"), spec("RAM", "8 GB"), spec("Almacenamiento", "256 GB"), spec("Cámara principal", "108 MP"), spec("Batería", "5000 mAh"), spec("Conectividad", "4G, Wi-Fi 5"), spec("Garantía", "12 meses")] }),
  make({ category: "movistar", brand: "Movistar", name: "Router Movistar Wi-Fi 6 Mesh", price: 299, listPrice: 349, stock: 60, rating: 4.2, reviews: 44, provider: "Movistar Perú", shortDescription: "Cobertura mesh para todo el hogar.", description: "Router Movistar Wi-Fi 6 con tecnología mesh para cobertura total y conexión estable en toda la casa.", specs: [spec("Estándar", "Wi-Fi 6 (802.11ax)"), spec("Velocidad", "Hasta 3000 Mbps"), spec("Bandas", "Doble banda"), spec("Puertos", "3x Gigabit Ethernet"), spec("Cobertura", "Hasta 200 m²"), spec("Garantía", "12 meses")] }),
  make({ category: "movistar", brand: "Movistar", name: "Chip Movistar Prepago + Recarga S/20", price: 20, listPrice: 25, stock: 999, rating: 4.0, reviews: 60, provider: "Movistar Perú", shortDescription: "Chip nuevo con saldo inicial incluido.", description: "Chip prepago Movistar con S/20 de saldo inicial y bono de datos de bienvenida.", specs: [spec("Tipo", "Prepago"), spec("Saldo inicial", "S/ 20"), spec("Bono", "Datos de bienvenida"), spec("Formato", "Triple SIM"), spec("Red", "4G/5G"), spec("Garantía", "—")] }),
  make({ category: "movistar", brand: "Movistar", name: "Powerbank Movistar 20000mAh", price: 119, listPrice: 149, stock: 85, rating: 4.3, reviews: 51, provider: "Movistar Perú", shortDescription: "Carga rápida 22.5W, 2 salidas USB.", description: "Batería portátil Movistar de 20000mAh con carga rápida 22.5W y dos salidas para cargar varios equipos.", specs: [spec("Capacidad", "20000 mAh"), spec("Carga rápida", "22.5W PD/QC"), spec("Salidas", "2x USB-A + 1 USB-C"), spec("Pantalla", "Indicador LED"), spec("Peso", "390 g"), spec("Garantía", "6 meses")] }),

  // ===================== TECNOLOGÍA (8 nuevos -> total 10) ==============
  make({ category: "tecnologia", brand: "Apple", name: "MacBook Air M3 13\"", price: 5499, listPrice: 5899, stock: 10, rating: 4.9, reviews: 95, featured: true, bestSeller: true, provider: "TechStore SAC", seller: "seller-002", shortDescription: "Chip M3, 8GB, 256GB SSD.", description: "MacBook Air con chip M3, pantalla Liquid Retina y hasta 18 horas de batería.", specs: [spec("Pantalla", "13.6\" Liquid Retina"), spec("Procesador", "Apple M3"), spec("RAM", "8 GB"), spec("Almacenamiento", "256 GB SSD"), spec("Batería", "Hasta 18 h"), spec("Peso", "1.24 kg"), spec("Sistema operativo", "macOS"), spec("Garantía", "12 meses")] }),
  make({ category: "tecnologia", brand: "HP", name: "Monitor HP 27\" IPS 100Hz", price: 749, listPrice: 899, stock: 25, rating: 4.5, reviews: 60, bestSeller: true, provider: "TechStore SAC", seller: "seller-002", shortDescription: "Full HD, IPS, 100Hz, sin bordes.", description: "Monitor HP de 27 pulgadas Full HD IPS con 100Hz, ideal para trabajo y entretenimiento.", specs: [spec("Tamaño", "27 pulgadas"), spec("Resolución", "1920x1080 Full HD"), spec("Panel", "IPS"), spec("Frecuencia", "100 Hz"), spec("Puertos", "HDMI + VGA"), spec("Garantía", "12 meses")] }),
  make({ category: "tecnologia", brand: "Logitech", name: "Teclado y Mouse Logitech MK540", price: 189, listPrice: 229, stock: 70, rating: 4.6, reviews: 88, provider: "TechStore SAC", seller: "seller-002", shortDescription: "Combo inalámbrico silencioso.", description: "Combo inalámbrico Logitech MK540 con teclado de tamaño completo y mouse ergonómico.", specs: [spec("Conexión", "Inalámbrica 2.4GHz (USB)"), spec("Teclado", "Tamaño completo + teclas rápidas"), spec("Mouse", "1000 DPI ergonómico"), spec("Batería teclado", "Hasta 36 meses"), spec("Batería mouse", "Hasta 18 meses"), spec("Garantía", "12 meses")] }),
  make({ category: "tecnologia", brand: "Sony", name: "Audífonos Sony WH-1000XM5", price: 1299, listPrice: 1499, stock: 20, rating: 4.8, reviews: 140, featured: true, provider: "TechStore SAC", seller: "seller-002", shortDescription: "Cancelación de ruido líder, 30h.", description: "Audífonos over-ear Sony WH-1000XM5 con la mejor cancelación de ruido y 30h de batería.", specs: [spec("Tipo", "Over-ear inalámbricos"), spec("Cancelación de ruido", "Adaptativa (ANC)"), spec("Autonomía", "30 h"), spec("Carga rápida", "3 min = 3 h"), spec("Conectividad", "Bluetooth 5.2 + multipunto"), spec("Garantía", "12 meses")] }),
  make({ category: "tecnologia", brand: "Kingston", name: "SSD Kingston NV2 1TB NVMe", price: 329, listPrice: 399, stock: 90, rating: 4.7, reviews: 102, bestSeller: true, provider: "TechStore SAC", seller: "seller-002", shortDescription: "SSD M.2 PCIe 4.0, lectura 3500MB/s.", description: "Unidad SSD Kingston NV2 de 1TB M.2 NVMe PCIe 4.0 para acelerar tu PC o laptop.", specs: [spec("Capacidad", "1 TB"), spec("Formato", "M.2 2280 NVMe"), spec("Interfaz", "PCIe 4.0"), spec("Lectura", "Hasta 3500 MB/s"), spec("Escritura", "Hasta 2100 MB/s"), spec("Garantía", "36 meses")] }),
  make({ category: "tecnologia", brand: "TP-Link", name: "Cámara de Seguridad Wi-Fi Tapo C200", price: 109, listPrice: 139, stock: 110, rating: 4.4, reviews: 76, provider: "TechStore SAC", seller: "seller-002", shortDescription: "1080p, visión nocturna, giro 360°.", description: "Cámara de seguridad Wi-Fi Tapo C200 con 1080p, visión nocturna y seguimiento de movimiento.", specs: [spec("Resolución", "1080p Full HD"), spec("Visión nocturna", "Hasta 9 m"), spec("Movimiento", "Giro 360° / inclinación"), spec("Almacenamiento", "microSD hasta 256 GB"), spec("App", "Tapo (Android/iOS)"), spec("Garantía", "12 meses")] }),
  make({ category: "tecnologia", brand: "Anker", name: "Cargador Anker GaN 65W", price: 129, listPrice: 159, stock: 130, rating: 4.7, reviews: 64, provider: "TechStore SAC", seller: "seller-002", shortDescription: "USB-C 65W para laptop y móvil.", description: "Cargador Anker GaN de 65W con 2 puertos para cargar laptop, tablet y móvil a la vez.", specs: [spec("Potencia", "65 W"), spec("Tecnología", "GaN II"), spec("Puertos", "2x USB-C"), spec("Compatibilidad", "Laptop, tablet, móvil"), spec("Tamaño", "Compacto de viaje"), spec("Garantía", "18 meses")] }),
  make({ category: "tecnologia", brand: "Amazon", name: "Streaming Fire TV Stick 4K", price: 229, listPrice: 279, stock: 95, rating: 4.6, reviews: 150, featured: true, provider: "TechStore SAC", seller: "seller-002", shortDescription: "Convierte tu TV en Smart TV 4K.", description: "Fire TV Stick 4K con Alexa por voz para transmitir en 4K Ultra HD desde tus apps favoritas.", specs: [spec("Resolución", "4K Ultra HD"), spec("HDR", "Dolby Vision / HDR10+"), spec("Control", "Por voz con Alexa"), spec("Conexión", "HDMI + Wi-Fi 6"), spec("Apps", "Netflix, Prime, Disney+, etc."), spec("Garantía", "12 meses")] }),

  // ===================== HOGAR (8 nuevos -> total 10) ===================
  make({ category: "hogar", brand: "LG", name: "Lavadora LG 15kg Carga Frontal", price: 1899, listPrice: 2199, stock: 12, rating: 4.6, reviews: 70, featured: true, bestSeller: true, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "15kg, AI DD, vapor higienizante.", description: "Lavadora LG de carga frontal 15kg con tecnología AI DD y vapor para un lavado más cuidadoso.", specs: [spec("Capacidad", "15 kg"), spec("Tipo", "Carga frontal"), spec("Tecnología", "AI DD + vapor"), spec("Eficiencia", "Clase A"), spec("Motor", "Inverter Direct Drive"), spec("Garantía", "12 meses (10 años motor)")] }),
  make({ category: "hogar", brand: "Philips", name: "Freidora de Aire Philips 4.1L", price: 399, listPrice: 499, stock: 50, rating: 4.7, reviews: 130, bestSeller: true, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Air Fryer sin aceite, 4.1 litros.", description: "Freidora de aire Philips de 4.1L con tecnología Rapid Air para frituras sin aceite.", specs: [spec("Capacidad", "4.1 litros"), spec("Potencia", "1400 W"), spec("Tecnología", "Rapid Air"), spec("Temperatura", "Hasta 200 °C"), spec("Material cesta", "Antiadherente"), spec("Garantía", "12 meses")] }),
  make({ category: "hogar", brand: "Bosch", name: "Microondas Bosch 25L", price: 549, listPrice: 649, stock: 30, rating: 4.5, reviews: 55, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "25 litros, grill, 900W.", description: "Microondas Bosch de 25 litros con función grill y 900W de potencia.", specs: [spec("Capacidad", "25 litros"), spec("Potencia", "900 W"), spec("Funciones", "Microondas + grill"), spec("Niveles", "5 de potencia"), spec("Panel", "Digital táctil"), spec("Garantía", "12 meses")] }),
  make({ category: "hogar", brand: "Dyson", name: "Aspiradora Dyson V8 Inalámbrica", price: 1699, listPrice: 1999, stock: 15, rating: 4.8, reviews: 90, featured: true, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Inalámbrica, hasta 40 min.", description: "Aspiradora Dyson V8 inalámbrica con potente succión y hasta 40 minutos de autonomía.", specs: [spec("Tipo", "Vertical inalámbrica"), spec("Autonomía", "Hasta 40 min"), spec("Filtración", "HEPA sellada"), spec("Capacidad", "0.54 L"), spec("Accesorios", "Múltiples cabezales"), spec("Garantía", "12 meses")] }),
  make({ category: "hogar", brand: "T-fal", name: "Juego de Ollas T-fal 7 piezas", price: 349, listPrice: 429, stock: 45, rating: 4.4, reviews: 48, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Antiadherentes con indicador Thermo-Spot.", description: "Set de 7 piezas T-fal con recubrimiento antiadherente e indicador de temperatura Thermo-Spot.", specs: [spec("Piezas", "7"), spec("Material", "Aluminio antiadherente"), spec("Indicador", "Thermo-Spot"), spec("Aptas para", "Gas y eléctrica"), spec("Lavado", "Apto lavavajillas"), spec("Garantía", "12 meses")] }),
  make({ category: "hogar", brand: "Record", name: "Juego de Sábanas King 400 Hilos", price: 149, listPrice: 199, stock: 80, rating: 4.3, reviews: 37, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Algodón 400 hilos, tamaño King.", description: "Juego de sábanas King de algodón 400 hilos: suave, fresco y de larga duración.", specs: [spec("Tamaño", "King"), spec("Material", "100% algodón"), spec("Densidad", "400 hilos"), spec("Incluye", "1 sábana + funda + 2 fundas de almohada"), spec("Cuidado", "Lavable en máquina"), spec("Garantía", "30 días")] }),
  make({ category: "hogar", brand: "Imaco", name: "Hervidor Eléctrico 1.7L", price: 79, listPrice: 99, stock: 120, rating: 4.2, reviews: 29, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Acero inoxidable, apagado automático.", description: "Hervidor eléctrico de 1.7L en acero inoxidable con apagado automático y protección anti-seco.", specs: [spec("Capacidad", "1.7 litros"), spec("Potencia", "1500 W"), spec("Material", "Acero inoxidable"), spec("Seguridad", "Apagado automático"), spec("Base", "Giratoria 360°"), spec("Garantía", "12 meses")] }),
  make({ category: "hogar", brand: "Philips", name: "Plancha a Vapor Philips 2400W", price: 139, listPrice: 169, stock: 90, rating: 4.4, reviews: 42, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Golpe de vapor y suela antiadherente.", description: "Plancha a vapor Philips de 2400W con golpe de vapor potente y suela antiadherente.", specs: [spec("Potencia", "2400 W"), spec("Golpe de vapor", "150 g/min"), spec("Suela", "Antiadherente"), spec("Depósito", "300 ml"), spec("Anti-cal", "Sí"), spec("Garantía", "12 meses")] }),

  // ===================== DEPORTES (8 nuevos -> total 10) ================
  // prod-009 (Adidas) y prod-008 (Nike reasignado) ya suman 2.
  make({ category: "deportes", brand: "Nike", name: "Zapatillas Nike Revolution 7", price: 299, listPrice: 349, stock: 70, rating: 4.6, reviews: 110, featured: true, bestSeller: true, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Running cómodas y ligeras.", description: "Zapatillas Nike Revolution 7 para running con amortiguación suave y buen agarre.", specs: [spec("Tipo", "Running"), spec("Amortiguación", "Espuma suave"), spec("Material superior", "Malla transpirable"), spec("Suela", "Caucho"), spec("Tallas", "38 a 45"), spec("Garantía", "Cambio por talla (30 días)")] }),
  make({ category: "deportes", brand: "Wilson", name: "Pelota de Básquet Wilson #7", price: 129, listPrice: 159, stock: 100, rating: 4.5, reviews: 54, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Tamaño oficial, interior/exterior.", description: "Pelota de básquet Wilson tamaño 7 oficial, apta para interior y exterior.", specs: [spec("Deporte", "Básquet"), spec("Tamaño", "7 (oficial)"), spec("Material", "Caucho resistente"), spec("Uso", "Interior / exterior"), spec("Inflado", "Con aguja"), spec("Garantía", "30 días")] }),
  make({ category: "deportes", brand: "Trek", name: "Bicicleta Montañera Aro 29", price: 1499, listPrice: 1799, stock: 18, rating: 4.7, reviews: 61, featured: true, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Aro 29, 21 velocidades, frenos a disco.", description: "Bicicleta montañera aro 29 con cuadro de aluminio, 21 velocidades y frenos a disco.", specs: [spec("Aro", "29 pulgadas"), spec("Cuadro", "Aluminio"), spec("Velocidades", "21"), spec("Frenos", "A disco"), spec("Suspensión", "Delantera"), spec("Garantía", "12 meses")] }),
  make({ category: "deportes", brand: "Under Armour", name: "Mancuernas Ajustables 20kg (par)", price: 399, listPrice: 499, stock: 40, rating: 4.6, reviews: 48, bestSeller: true, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Par ajustable hasta 20kg c/u.", description: "Par de mancuernas ajustables hasta 20kg cada una, ideales para entrenamiento en casa.", specs: [spec("Peso máximo", "20 kg por mancuerna"), spec("Ajuste", "Discos intercambiables"), spec("Material", "Acero + recubrimiento"), spec("Uso", "Entrenamiento en casa"), spec("Incluye", "Par de mancuernas"), spec("Garantía", "12 meses")] }),
  make({ category: "deportes", brand: "Decathlon", name: "Colchoneta de Yoga 8mm", price: 89, listPrice: 119, stock: 150, rating: 4.4, reviews: 72, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Antideslizante, 8mm de grosor.", description: "Colchoneta de yoga de 8mm antideslizante y acolchada para yoga, pilates y estiramientos.", specs: [spec("Grosor", "8 mm"), spec("Material", "NBR antideslizante"), spec("Medidas", "183 x 61 cm"), spec("Peso", "900 g"), spec("Incluye", "Correa de transporte"), spec("Garantía", "30 días")] }),
  make({ category: "deportes", brand: "Puma", name: "Mochila Deportiva Puma 25L", price: 149, listPrice: 189, stock: 90, rating: 4.3, reviews: 38, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "25L, compartimento para laptop.", description: "Mochila deportiva Puma de 25L con compartimento acolchado para laptop y bolsillo para botella.", specs: [spec("Capacidad", "25 litros"), spec("Compartimentos", "Principal + laptop + frontal"), spec("Material", "Poliéster resistente"), spec("Laptop", "Hasta 15.6\""), spec("Uso", "Deporte / diario"), spec("Garantía", "30 días")] }),
  make({ category: "deportes", brand: "Garmin", name: "Reloj Deportivo Garmin Forerunner 55", price: 899, listPrice: 1049, stock: 25, rating: 4.7, reviews: 83, featured: true, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "GPS, planes de entrenamiento.", description: "Reloj Garmin Forerunner 55 con GPS, métricas de carrera y planes de entrenamiento adaptados.", specs: [spec("GPS", "Integrado"), spec("Autonomía", "Hasta 2 semanas"), spec("Sensores", "Ritmo cardíaco en muñeca"), spec("Resistencia", "5 ATM"), spec("Compatibilidad", "Android e iOS"), spec("Garantía", "12 meses")] }),
  make({ category: "deportes", brand: "Everlast", name: "Set de Guantes de Box + Vendas", price: 169, listPrice: 219, stock: 60, rating: 4.5, reviews: 41, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Guantes 12oz + vendas incluidas.", description: "Set Everlast con guantes de box de 12oz y vendas elásticas para entrenamiento.", specs: [spec("Peso", "12 oz"), spec("Material", "Cuero sintético"), spec("Incluye", "Par de guantes + vendas"), spec("Cierre", "Velcro ajustable"), spec("Uso", "Entrenamiento / sparring ligero"), spec("Garantía", "30 días")] }),

  // ===================== JUGUETES (9 nuevos -> total 10) ================
  make({ category: "juguetes", brand: "LEGO", name: "LEGO City Estación de Policía", price: 349, listPrice: 429, stock: 35, rating: 4.8, reviews: 90, featured: true, bestSeller: true, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "668 piezas, 6 minifiguras.", description: "Set LEGO City Estación de Policía con 668 piezas, vehículos y 6 minifiguras.", specs: [spec("Piezas", "668"), spec("Edad recomendada", "6+ años"), spec("Minifiguras", "6"), spec("Tema", "LEGO City"), spec("Incluye", "Vehículos y accesorios"), spec("Garantía", "Reposición de piezas (30 días)")] }),
  make({ category: "juguetes", brand: "Mattel", name: "Barbie Casa de los Sueños", price: 599, listPrice: 749, stock: 20, rating: 4.7, reviews: 65, featured: true, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "3 pisos, 10 áreas, accesorios.", description: "Barbie Casa de los Sueños con 3 pisos, ascensor, piscina y más de 70 accesorios.", specs: [spec("Pisos", "3"), spec("Áreas de juego", "10+"), spec("Accesorios", "70+ piezas"), spec("Edad recomendada", "3+ años"), spec("Altura", "Más de 1 m"), spec("Garantía", "30 días")] }),
  make({ category: "juguetes", brand: "Hasbro", name: "Nerf Elite 2.0 Commander", price: 149, listPrice: 189, stock: 80, rating: 4.5, reviews: 58, bestSeller: true, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Lanzador con 6 dardos incluidos.", description: "Lanzador Nerf Elite 2.0 Commander con tambor rotatorio y 6 dardos oficiales.", specs: [spec("Capacidad", "6 dardos"), spec("Alcance", "Hasta 27 m"), spec("Edad recomendada", "8+ años"), spec("Incluye", "6 dardos Elite"), spec("Compatibilidad", "Dardos Nerf Elite"), spec("Garantía", "30 días")] }),
  make({ category: "juguetes", brand: "Fisher-Price", name: "Fisher-Price Mesa de Aprendizaje", price: 169, listPrice: 209, stock: 55, rating: 4.6, reviews: 44, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Luces, sonidos y bilingüe.", description: "Mesa de aprendizaje Fisher-Price bilingüe con luces, música y actividades para bebés.", specs: [spec("Edad recomendada", "6-36 meses"), spec("Idiomas", "Español e inglés"), spec("Modos", "Música y aprendizaje"), spec("Patas", "Desmontables"), spec("Pilas", "Incluidas"), spec("Garantía", "30 días")] }),
  make({ category: "juguetes", brand: "Rubik's", name: "Cubo Rubik 3x3 Original", price: 49, listPrice: 69, stock: 200, rating: 4.7, reviews: 120, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Giro suave, el clásico original.", description: "Cubo Rubik 3x3 original con mecanismo de giro suave para resolver el rompecabezas clásico.", specs: [spec("Tipo", "3x3"), spec("Edad recomendada", "8+ años"), spec("Mecanismo", "Giro suave"), spec("Material", "Plástico ABS"), spec("Incluye", "Guía de resolución"), spec("Garantía", "30 días")] }),
  make({ category: "juguetes", brand: "Hot Wheels", name: "Hot Wheels Pista Super Loop", price: 199, listPrice: 249, stock: 70, rating: 4.5, reviews: 61, featured: true, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Pista con loop y 2 autos.", description: "Pista Hot Wheels Super Loop con lanzador motorizado y 2 autos incluidos.", specs: [spec("Incluye", "Pista + 2 autos"), spec("Edad recomendada", "5+ años"), spec("Tipo", "Pista motorizada"), spec("Escala autos", "1:64"), spec("Expandible", "Compatible con otras pistas"), spec("Garantía", "30 días")] }),
  make({ category: "juguetes", brand: "Play-Doh", name: "Play-Doh Set 20 Botes", price: 79, listPrice: 99, stock: 140, rating: 4.6, reviews: 73, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "20 colores de masa no tóxica.", description: "Set Play-Doh con 20 botes de masa de modelar no tóxica en colores variados.", specs: [spec("Botes", "20"), spec("Edad recomendada", "2+ años"), spec("Material", "Masa no tóxica"), spec("Peso por bote", "56 g"), spec("Certificación", "Seguridad infantil"), spec("Garantía", "—")] }),
  make({ category: "juguetes", brand: "UNO", name: "Juego de Cartas UNO", price: 29, listPrice: 39, stock: 250, rating: 4.8, reviews: 180, bestSeller: true, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "El clásico juego de cartas familiar.", description: "Juego de cartas UNO para toda la familia, de 2 a 10 jugadores.", specs: [spec("Jugadores", "2 a 10"), spec("Edad recomendada", "7+ años"), spec("Cartas", "112"), spec("Duración", "15-30 min"), spec("Incluye", "Reglas"), spec("Garantía", "—")] }),
  make({ category: "juguetes", brand: "Melissa & Doug", name: "Rompecabezas de Madera 100 pzs", price: 69, listPrice: 89, stock: 90, rating: 4.5, reviews: 36, provider: "Hogar Total EIRL", seller: "seller-003", shortDescription: "Madera, ilustración de animales.", description: "Rompecabezas de madera de 100 piezas con ilustración de animales para desarrollar concentración.", specs: [spec("Piezas", "100"), spec("Edad recomendada", "5+ años"), spec("Material", "Madera"), spec("Tema", "Animales"), spec("Beneficios", "Concentración y motricidad"), spec("Garantía", "30 días")] })
];

const products = [...reassigned, ...newProducts];

// --- Escribe products.json -------------------------------------------------
writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2) + "\n", "utf8");

// --- Genera imágenes SVG de marcador de posición ---------------------------
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const wrap = (text, maxChars) => {
  const words = String(text).split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars) {
      if (line) lines.push(line.trim());
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines.slice(0, 4);
};

const svgFor = (p) => {
  const [c1, c2] = palette[p.category] || ["#64748b", "#1e293b"];
  const gid = `g-${p.id}`;
  const lines = wrap(p.name, 20);
  const startY = 430 - (lines.length - 1) * 20;
  const tspans = lines
    .map(
      (ln, i) =>
        `<tspan x="400" dy="${i === 0 ? 0 : 40}">${esc(ln)}</tspan>`
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img" aria-label="${esc(
    p.name
  )}">
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="${gid ? `url(#${gid})` : c1}"/>
  <circle cx="640" cy="160" r="190" fill="#ffffff" opacity="0.08"/>
  <circle cx="150" cy="650" r="150" fill="#ffffff" opacity="0.06"/>
  <text x="400" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="150" fill="#ffffff" opacity="0.9">${esc(
    (p.brand || "?").slice(0, 1).toUpperCase()
  )}</text>
  <text x="400" y="${startY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#ffffff">${tspans}</text>
  <text x="400" y="640" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#ffffff" opacity="0.85">${esc(
    p.brand
  )}</text>
</svg>
`;
};

let created = 0;
let skipped = 0;
for (const p of products) {
  (p.images || []).forEach((imgPath, i) => {
    // Solo generamos para rutas .svg (las .jpg originales ya existen).
    if (!imgPath.endsWith(".svg")) {
      skipped++;
      return;
    }
    const file = join(ROOT, "public", imgPath.replace(/^\//, ""));
    writeFileSync(file, svgFor(p), "utf8");
    created++;
  });
}

const perCat = {};
for (const p of products) perCat[p.category] = (perCat[p.category] || 0) + 1;

console.log(`products.json: ${products.length} productos`);
console.log("Por categoría:", perCat);
console.log(`Imágenes SVG creadas: ${created}, saltadas (.jpg existentes): ${skipped}`);
