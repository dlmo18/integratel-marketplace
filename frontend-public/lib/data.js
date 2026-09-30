import categories from "@/data/categories.json";
import products from "@/data/products.json";
import users from "@/data/users.json";
import orders from "@/data/orders.json";
import sales from "@/data/sales.json";
import transactions from "@/data/transactions.json";
import returns from "@/data/returns.json";
import points from "@/data/points.json";
import vouchers from "@/data/vouchers.json";

export const getCategories = () => categories;

export const getCategoryBySlug = (slug) =>
  categories.find((c) => c.slug === slug);

export const getProducts = () => products;

export const getProductBySlug = (slug) =>
  products.find((p) => p.slug === slug);

export const getProductById = (id) => products.find((p) => p.id === id);

export const getFeaturedProducts = () => products.filter((p) => p.featured);

export const getBestSellers = () => products.filter((p) => p.bestSeller);

export const getOnSale = () => products.filter((p) => p.onSale);

export const getProductsByCategory = (slug) =>
  products.filter((p) => p.category === slug);

export const getBrands = () => [...new Set(products.map((p) => p.brand))].sort();

export const getProviders = () =>
  [...new Set(products.map((p) => p.provider))].sort();

export const getUsers = () => users;

export const findUserByCredentials = (email, password) =>
  users.find(
    (u) =>
      u.email.toLowerCase() === String(email).toLowerCase() &&
      u.password === password
  );

export const getUserById = (id) => users.find((u) => u.id === id);

// --- Resolución de identidad demo -------------------------------------------
// Los datos demo están asociados a las cuentas user-001 (comprador) y
// seller-001 (seller). Cuando el usuario logueado es una cuenta creada en el
// registro (id generado, sin datos propios), usamos como respaldo la cuenta
// demo correspondiente a su tipo para que la experiencia se vea poblada.
const DEMO_BUYER = "user-001";
const DEMO_SELLER = "seller-001";

const acceptsId = (id) => (typeof id === "object" && id ? id.id : id);
const acceptsType = (id) => (typeof id === "object" && id ? id.type : null);

const resolveBuyerId = (userOrId) => {
  const id = acceptsId(userOrId);
  if (id && orders.some((o) => o.buyer === id)) return id;
  return DEMO_BUYER;
};

const resolveSellerId = (userOrId) => {
  const id = acceptsId(userOrId);
  if (id && sales.some((s) => s.seller === id)) return id;
  return DEMO_SELLER;
};

export const getOrdersByBuyer = (userOrId) => {
  const id = resolveBuyerId(userOrId);
  return orders.filter((o) => o.buyer === id);
};

export const getSalesBySeller = (userOrId) => {
  const id = resolveSellerId(userOrId);
  return sales.filter((s) => s.seller === id);
};

export const getTransactionsBySeller = (userOrId) => {
  const id = resolveSellerId(userOrId);
  return transactions.filter((t) => t.seller === id);
};

export const getReturnsByBuyer = (userOrId) => {
  const id = resolveBuyerId(userOrId);
  return returns.filter((r) => r.buyer === id);
};

export const getSellerProducts = (userOrId) => {
  const id = acceptsId(userOrId);
  const own = id ? products.filter((p) => p.seller === id) : [];
  return own.length ? own : products.filter((p) => p.seller === DEMO_SELLER);
};

// --- Puntos y vouchers ------------------------------------------------------
const resolvePointsUser = (userOrId) => {
  const id = acceptsId(userOrId);
  if (id && points.some((p) => p.user === id)) return id;
  return acceptsType(userOrId) === "seller" ? DEMO_SELLER : DEMO_BUYER;
};

const resolveVoucherUser = (userOrId) => {
  const id = acceptsId(userOrId);
  if (id && vouchers.some((v) => v.user === id)) return id;
  return acceptsType(userOrId) === "seller" ? DEMO_SELLER : DEMO_BUYER;
};

export const getPoints = (userOrId) => {
  const id = resolvePointsUser(userOrId);
  return points.find((p) => p.user === id) || { balance: 0, history: [] };
};

export const getVouchersByUser = (userOrId) => {
  const id = resolveVoucherUser(userOrId);
  return vouchers.filter((v) => v.user === id);
};

// Catálogo de recompensas canjeables por puntos (genera vouchers).
export const getRewards = () => [
  { id: "rw-1", title: "Voucher S/ 10 de descuento", cost: 300, discountType: "fixed", value: 10 },
  { id: "rw-2", title: "Voucher S/ 20 de descuento", cost: 500, discountType: "fixed", value: 20 },
  { id: "rw-3", title: "Voucher S/ 50 de descuento", cost: 1200, discountType: "fixed", value: 50 },
  { id: "rw-4", title: "Cupón 10% de descuento", cost: 800, discountType: "percent", value: 10 },
  { id: "rw-5", title: "Cupón 15% de descuento", cost: 1500, discountType: "percent", value: 15 },
  { id: "rw-6", title: "Cupón 25% de descuento", cost: 2500, discountType: "percent", value: 25 }
];

// Valida un código de voucher. Busca en los vouchers demo y, opcionalmente, en
// una lista extra (p. ej. giftcards compradas y guardadas en localStorage).
export const findVoucherByCode = (code, extra = []) => {
  if (!code) return null;
  const norm = String(code).trim().toLowerCase();
  const pool = [...vouchers, ...(extra || [])];
  const v = pool.find((x) => x.code.toLowerCase() === norm);
  if (!v) return { error: "Código no encontrado" };
  if (v.status === "expirado") return { error: "El voucher está expirado" };
  if (v.status === "usado") return { error: "El voucher ya fue utilizado" };
  return { voucher: v };
};

// --- Giftcards --------------------------------------------------------------
// Catálogo de tarjetas de regalo. Cada compra genera un voucher con código.
export const getGiftcards = () => [
  { id: "gc-25", amount: 25, discountType: "fixed", value: 25, image: "/img/banners/hero-ofertas.jpg" },
  { id: "gc-50", amount: 50, discountType: "fixed", value: 50, image: "/img/banners/hero-ecommerce.jpg" },
  { id: "gc-100", amount: 100, discountType: "fixed", value: 100, image: "/img/banners/hero-movistar.jpg" },
  { id: "gc-200", amount: 200, discountType: "fixed", value: 200, image: "/img/banners/hero-compras.jpg" }
];
