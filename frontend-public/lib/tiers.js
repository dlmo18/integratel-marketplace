// Metadatos de los perfiles de usuario. Los compradores tienen 4 niveles
// (Blue → Gold → Platinium → Black); los vendedores usan el perfil Seller.
// El color de cada tema vive en globals.css (data-theme).

export const BUYER_TIERS = ["blue", "gold", "platinium", "black"];

export const TIERS = {
  blue: {
    key: "blue",
    level: 1,
    label: "Movistar Blue",
    short: "Blue",
    icon: "star",
    discount: 20
  },
  gold: {
    key: "gold",
    level: 2,
    label: "Movistar Gold",
    short: "Gold",
    icon: "emoji_events",
    discount: 30
  },
  platinium: {
    key: "platinium",
    level: 3,
    label: "Movistar Platinium",
    short: "Platinium",
    icon: "workspace_premium",
    discount: 50
  },
  black: {
    key: "black",
    level: 4,
    label: "Movistar Black",
    short: "Black",
    icon: "diamond",
    discount: 70
  },
  seller: {
    key: "seller",
    level: 0,
    label: "Cuenta Seller",
    short: "Seller",
    icon: "storefront",
    discount: 0
  }
};

export const getTier = (key) => TIERS[key] || TIERS.blue;
