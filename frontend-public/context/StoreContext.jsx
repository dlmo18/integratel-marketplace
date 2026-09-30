"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState
} from "react";

const StoreContext = createContext(null);

const CART_KEY = "itm_cart";
const USER_KEY = "itm_user";
const VOUCHER_KEY = "itm_voucher";
const GIFTCARDS_KEY = "itm_giftcards";

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
  const [ready, setReady] = useState(false);

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

  // Tema de color según el tipo de usuario. No logueado => "regular".
  const resolveTier = (u) => {
    if (!u) return "regular";
    if (u.tier) return u.tier;
    if (u.type === "seller") return "seller";
    return "regular";
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
      addToCart: (product, qty) => dispatch({ type: "ADD", product, qty }),
      setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
      removeFromCart: (id) => dispatch({ type: "REMOVE", id }),
      clearCart,
      user,
      tier,
      isSeller: tier === "seller",
      isVip: tier === "vip",
      login,
      logout,
      ready
    };
  }, [cart, user, tier, voucher, giftcards, ready]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
};
