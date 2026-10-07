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

// --- IGV (impuesto general a las ventas, Perú = 18%) ------------------------
// En el marketplace los precios se muestran CON IGV incluido. Para el resumen
// desglosamos la base imponible y el IGV a partir del total con impuesto.
export const IGV_RATE = 0.18;

// Dado un monto que YA incluye IGV, devuelve { base, igv } redondeados a 2 dec.
export const breakdownIgv = (grossAmount, rate = IGV_RATE) => {
  const gross = Number(grossAmount || 0);
  const base = Math.round((gross / (1 + rate)) * 100) / 100;
  const igv = Math.round((gross - base) * 100) / 100;
  return { base, igv };
};
