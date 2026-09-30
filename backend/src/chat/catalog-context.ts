// Resumen del catálogo demo que se inyecta como contexto al agente de ventas.
// Es un snapshot ligero (nombre, categoría, marca, precio) para que la IA pueda
// recomendar productos reales del marketplace sin exponer toda la base.
export const CATALOG_SUMMARY = `
Categorías disponibles: Movistar, Tecnología, Hogar, Moda, Deportes, Belleza, Juguetes.

Productos destacados (nombre | categoría | marca | precio S/):
- Smartphone Movistar Galaxy A55 5G | Movistar | Samsung | 1299
- iPhone 15 128GB Movistar | Movistar | Apple | 3799
- Audífonos Movistar TWS Pro | Movistar | Movistar | 149
- Smartwatch Movistar FitBand 2 | Movistar | Movistar | 199
- Laptop Lenovo IdeaPad 3 Ryzen 5 | Tecnología | Lenovo | 1999
- Tablet Xiaomi Pad 6 | Tecnología | Xiaomi | 1499
- Refrigeradora Samsung 300L No Frost | Hogar | Samsung | 1799
- Licuadora Oster 3 Velocidades | Hogar | Oster | 189
- Polo Deportivo Nike Dri-FIT | Moda | Nike | 129
- Zapatillas Adidas Runfalcon | Deportes | Adidas | 249
- Set de Skincare Facial | Belleza | CeraVe | 179
- Set de Bloques de Construcción 500 pzs | Juguetes | BrickWorld | 149

Métodos de pago: billeteras (Yape/Plin), tarjeta, depósito bancario y "Pagos asociados" (cobro compartido entre varias fuentes).
Puntos y vouchers: los usuarios acumulan puntos por sus compras y pueden canjearlos por vouchers de descuento aplicables en el carrito.
Para vender: los usuarios pueden registrarse como "Seller" y publicar productos, gestionar stock y ver sus transacciones.
`.trim();
