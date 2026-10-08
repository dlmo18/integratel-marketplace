"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from "react";

const StoreContext = createContext(null);

const CART_KEY = "itm_cart";
const USER_KEY = "itm_user";
const VOUCHER_KEY = "itm_voucher";
const GIFTCARDS_KEY = "itm_giftcards";
const FAVORITES_KEY = "itm_favorites";
const COMPARE_KEY = "itm_compare";
const RECENT_KEY = "itm_recent";
const REVIEWS_KEY = "itm_reviews";

const MAX_COMPARE = 4;
const MAX_RECENT = 12;

function cartReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return action.payload || [];
    case "ADD": {
      const { product, qty = 1 } = action;
      const existing = state.find((i) => i.id === product.id);
      if (existing) {
        return state.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...state,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.images?.[0],
          qty
        }
      ];
    }
    case "SET_QTY":
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i))
        .filter((i) => i.qty > 0);
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [user, setUser] = useState(null);
  const [voucher, setVoucher] = useState(null);
  const [giftcards, setGiftcards] = useState([]);
  const [favorites, setFavorites] = useState([]); // array de product ids
  const [compare, setCompare] = useState([]); // array de product ids
  const [recent, setRecent] = useState([]); // array de product ids (más reciente primero)
  const [reviews, setReviews] = useState([]); // reseñas escritas por la comunidad
  const [toasts, setToasts] = useState([]);
  const [ready, setReady] = useState(false);

  const toastId = useRef(0);

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      dispatch({ type: "HYDRATE", payload: storedCart });
      const storedUser = JSON.parse(localStorage.getItem(USER_KEY) || "null");
      setUser(storedUser);
      const storedVoucher = JSON.parse(
        localStorage.getItem(VOUCHER_KEY) || "null"
      );
      setVoucher(storedVoucher);
      const storedGiftcards = JSON.parse(
        localStorage.getItem(GIFTCARDS_KEY) || "[]"
      );
      setGiftcards(storedGiftcards);
      setFavorites(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
      setCompare(JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]"));
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
      setReviews(JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]"));
    } catch (e) {
      // noop
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(VOUCHER_KEY, JSON.stringify(voucher));
  }, [voucher, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(GIFTCARDS_KEY, JSON.stringify(giftcards));
  }, [giftcards, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
  }, [compare, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  }, [recent, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews, ready]);

  // Tema de color según el perfil. Compradores: blue (N1) / gold (N2) /
  // platinium (N3) / black (N4). Vendedores: seller. Sin sesión => blue.
  const resolveTier = (u) => {
    if (!u) return "blue";
    if (u.type === "seller") return "seller";
    return u.tier || "blue";
  };
  const tier = resolveTier(user);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", tier);
    }
  }, [tier]);

  const login = (u) => {
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR" });
    setVoucher(null);
  };

  // --- Toasts (notificaciones efímeras) -------------------------------------
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, options = {}) => {
      const id = ++toastId.current;
      const { type = "success", icon, duration = 2600 } = options;
      setToasts((prev) => [...prev, { id, message, type, icon }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast]
  );

  const value = useMemo(() => {
    const count = cart.reduce((acc, i) => acc + i.qty, 0);
    const subtotal = cart.reduce((acc, i) => acc + i.qty * i.price, 0);

    // Descuento del voucher aplicado (si cumple el mínimo de compra).
    let discount = 0;
    if (voucher && subtotal >= (voucher.minPurchase || 0)) {
      discount =
        voucher.discountType === "percent"
          ? Math.round(subtotal * (voucher.value / 100) * 100) / 100
          : voucher.value;
      discount = Math.min(discount, subtotal);
    }

    // --- Favoritos ----------------------------------------------------------
    const isFavorite = (id) => favorites.includes(id);
    const toggleFavorite = (product) => {
      const id = typeof product === "object" ? product.id : product;
      const name = typeof product === "object" ? product.name : "Producto";
      setFavorites((prev) => {
        if (prev.includes(id)) {
          toast(`Quitado de favoritos`, { type: "info", icon: "💔" });
          return prev.filter((x) => x !== id);
        }
        toast(`${name} agregado a favoritos`, { icon: "❤️" });
        return [id, ...prev];
      });
    };

    // --- Comparador ---------------------------------------------------------
    const isComparing = (id) => compare.includes(id);
    const canAddCompare = compare.length < MAX_COMPARE;
    const toggleCompare = (product) => {
      const id = typeof product === "object" ? product.id : product;
      const name = typeof product === "object" ? product.name : "Producto";
      setCompare((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= MAX_COMPARE) {
          toast(`Máximo ${MAX_COMPARE} productos para comparar`, {
            type: "info",
            icon: "⚖️"
          });
          return prev;
        }
        toast(`${name} agregado al comparador`, { icon: "⚖️" });
        return [...prev, id];
      });
    };
    const clearCompare = () => setCompare([]);

    // --- Vistos recientemente ----------------------------------------------
    const registerRecent = (id) => {
      setRecent((prev) => {
        const next = [id, ...prev.filter((x) => x !== id)];
        return next.slice(0, MAX_RECENT);
      });
    };

    // --- Reseñas de la comunidad -------------------------------------------
    const addReview = (review) => {
      const entry = {
        id: `urev-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        userId: user?.id || "guest",
        ...review
      };
      setReviews((prev) => [entry, ...prev]);
      toast("¡Gracias! Tu reseña fue publicada", { icon: "⭐" });
      return entry;
    };
    const getUserReviews = (productId) =>
      productId ? reviews.filter((r) => r.productId === productId) : reviews;

    return {
      cart,
      cartCount: count,
      subtotal,
      voucher,
      discount,
      applyVoucher: (v) => setVoucher(v),
      removeVoucher: () => setVoucher(null),
      giftcards,
      addGiftcard: (g) => setGiftcards((prev) => [g, ...prev]),
      addToCart: (product, qty = 1, opts = {}) => {
        dispatch({ type: "ADD", product, qty });
        if (opts.silent !== true) {
          toast(`${product.name} agregado al carrito`, { icon: "🛒" });
        }
      },
      setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
      removeFromCart: (id) => dispatch({ type: "REMOVE", id }),
      clearCart,
      // favoritos
      favorites,
      favoritesCount: favorites.length,
      isFavorite,
      toggleFavorite,
      // comparador
      compare,
      compareCount: compare.length,
      maxCompare: MAX_COMPARE,
      isComparing,
      canAddCompare,
      toggleCompare,
      clearCompare,
      // vistos recientemente
      recent,
      registerRecent,
      // reseñas
      reviews,
      addReview,
      getUserReviews,
      // toasts
      toasts,
      toast,
      removeToast,
      user,
      tier,
      isSeller: tier === "seller",
      isBuyer: tier !== "seller",
      // Nivel del comprador (1-4). Útil para beneficios/escala de niveles.
      tierLevel:
        { blue: 1, gold: 2, platinium: 3, black: 4 }[tier] || 1,
      // Compatibilidad: "VIP" ahora corresponde al nivel Black.
      isVip: tier === "black",
      login,
      logout,
      ready
    };
  }, [
    cart,
    user,
    tier,
    voucher,
    giftcards,
    favorites,
    compare,
    recent,
    reviews,
    toasts,
    toast,
    removeToast,
    ready
  ]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
};
