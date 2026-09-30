export const formatCurrency = (value, currency = "PEN") =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency
  }).format(Number(value || 0));

export const formatDate = (value) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
