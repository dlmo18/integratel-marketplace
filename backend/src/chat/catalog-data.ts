// Catálogo estructurado para el motor de recomendación del perfilador.
// Snapshot ligero del catálogo demo (frontend-public/data/products.json) con
// metadatos adicionales (tags, nivel de precio) que facilitan el matching.

export type PriceTier = "bajo" | "medio" | "alto";

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  category: string; // movistar | tecnologia | hogar | moda | deportes | belleza | juguetes
  brand: string;
  price: number;
  priceTier: PriceTier;
  rating: number;
  image: string;
  shortDescription: string;
  tags: string[]; // intereses/casos de uso para el matching
}

export const CATALOG: CatalogProduct[] = [
  {
    id: "prod-001",
    name: "Smartphone Movistar Galaxy A55 5G",
    slug: "movistar-galaxy-a55-5g",
    category: "movistar",
    brand: "Samsung",
    price: 1299,
    priceTier: "medio",
    rating: 4.6,
    image: "/img/products/prod-001-0.jpg",
    shortDescription: "Pantalla Super AMOLED 6.6\", 128GB, 5G. Incluye chip Movistar.",
    tags: ["telefonia", "tecnologia", "conectividad", "trabajo", "entretenimiento", "regalo"]
  },
  {
    id: "prod-002",
    name: "iPhone 15 128GB Movistar",
    slug: "iphone-15-128gb-movistar",
    category: "movistar",
    brand: "Apple",
    price: 3799,
    priceTier: "alto",
    rating: 4.9,
    image: "/img/products/prod-002-0.jpg",
    shortDescription: "Chip A16 Bionic, cámara de 48MP, portabilidad Movistar disponible.",
    tags: ["telefonia", "tecnologia", "premium", "fotografia", "entretenimiento", "regalo"]
  },
  {
    id: "prod-003",
    name: "Audífonos Movistar TWS Pro",
    slug: "audifonos-movistar-tws-pro",
    category: "movistar",
    brand: "Movistar",
    price: 149,
    priceTier: "bajo",
    rating: 4.3,
    image: "/img/products/prod-003-0.jpg",
    shortDescription: "Audífonos inalámbricos con cancelación de ruido.",
    tags: ["tecnologia", "audio", "musica", "entretenimiento", "deporte", "regalo"]
  },
  {
    id: "prod-004",
    name: "Laptop Lenovo IdeaPad 3 Ryzen 5",
    slug: "laptop-lenovo-ideapad-3-ryzen-5",
    category: "tecnologia",
    brand: "Lenovo",
    price: 1999,
    priceTier: "alto",
    rating: 4.5,
    image: "/img/products/prod-004-0.jpg",
    shortDescription: "Ryzen 5, 16GB RAM, 512GB SSD, pantalla 15.6\" FHD.",
    tags: ["tecnologia", "trabajo", "estudio", "productividad", "computo"]
  },
  {
    id: "prod-005",
    name: "Tablet Xiaomi Pad 6",
    slug: "tablet-xiaomi-pad-6",
    category: "tecnologia",
    brand: "Xiaomi",
    price: 1499,
    priceTier: "medio",
    rating: 4.4,
    image: "/img/products/prod-005-0.jpg",
    shortDescription: "Pantalla 11\" 144Hz, Snapdragon 870, 128GB.",
    tags: ["tecnologia", "entretenimiento", "estudio", "productividad", "regalo"]
  },
  {
    id: "prod-006",
    name: "Refrigeradora Samsung 300L No Frost",
    slug: "refrigeradora-samsung-300l",
    category: "hogar",
    brand: "Samsung",
    price: 1799,
    priceTier: "alto",
    rating: 4.7,
    image: "/img/products/prod-006-0.jpg",
    shortDescription: "Tecnología No Frost, 300 litros, bajo consumo.",
    tags: ["hogar", "cocina", "familia", "electrodomestico"]
  },
  {
    id: "prod-007",
    name: "Licuadora Oster 3 Velocidades",
    slug: "licuadora-oster-3-velocidades",
    category: "hogar",
    brand: "Oster",
    price: 189,
    priceTier: "bajo",
    rating: 4.2,
    image: "/img/products/prod-007-0.jpg",
    shortDescription: "Jarra de vidrio, cuchillas de acero inoxidable.",
    tags: ["hogar", "cocina", "familia", "electrodomestico", "regalo"]
  },
  {
    id: "prod-008",
    name: "Polo Deportivo Nike Dri-FIT",
    slug: "polo-deportivo-nike-dri-fit",
    category: "moda",
    brand: "Nike",
    price: 129,
    priceTier: "bajo",
    rating: 4.5,
    image: "/img/products/prod-008-0.jpg",
    shortDescription: "Tela transpirable Dri-FIT, tallas S a XL.",
    tags: ["moda", "deporte", "ropa", "fitness", "regalo"]
  },
  {
    id: "prod-009",
    name: "Zapatillas Adidas Runfalcon",
    slug: "zapatillas-adidas-runfalcon",
    category: "deportes",
    brand: "Adidas",
    price: 249,
    priceTier: "medio",
    rating: 4.6,
    image: "/img/products/prod-009-0.jpg",
    shortDescription: "Zapatillas de running, amortiguación Cloudfoam.",
    tags: ["deporte", "moda", "fitness", "running", "regalo"]
  },
  {
    id: "prod-010",
    name: "Set de Skincare Facial",
    slug: "set-skincare-facial",
    category: "belleza",
    brand: "CeraVe",
    price: 179,
    priceTier: "bajo",
    rating: 4.8,
    image: "/img/products/prod-010-0.jpg",
    shortDescription: "Limpiador, hidratante y protector solar.",
    tags: ["belleza", "cuidado", "personal", "regalo"]
  },
  {
    id: "prod-011",
    name: "Set de Bloques de Construcción 500 pzs",
    slug: "set-bloques-construccion-500",
    category: "juguetes",
    brand: "BrickWorld",
    price: 149,
    priceTier: "bajo",
    rating: 4.4,
    image: "/img/products/prod-011-0.jpg",
    shortDescription: "500 piezas compatibles, estimula la creatividad.",
    tags: ["juguetes", "ninos", "familia", "regalo", "creatividad"]
  },
  {
    id: "prod-012",
    name: "Smartwatch Movistar FitBand 2",
    slug: "smartwatch-movistar-fitband-2",
    category: "movistar",
    brand: "Movistar",
    price: 199,
    priceTier: "bajo",
    rating: 4.1,
    image: "/img/products/prod-012-0.jpg",
    shortDescription: "Monitor de ritmo cardíaco, notificaciones y GPS.",
    tags: ["tecnologia", "deporte", "fitness", "salud", "wearable", "regalo"]
  }
];
