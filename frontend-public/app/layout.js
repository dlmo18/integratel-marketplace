import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VirtualAssistant from "@/components/VirtualAssistant";
import Toaster from "@/components/Toaster";
import CompareBar from "@/components/CompareBar";

export const metadata = {
  title: "Movistar Marketplace",
  description:
    "Marketplace Movistar: equipos, accesorios, servicios digitales y productos de sellers.",
  // Favicon SVG inline (data URI) para evitar el 404 de /favicon.ico sin
  // necesidad de un binario en el repo.
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%2300A9E0'/%3E%3Ctext x='16' y='22' font-family='Arial,Helvetica,sans-serif' font-size='18' font-weight='700' text-anchor='middle' fill='white'%3EM%3C/text%3E%3C/svg%3E",
        type: "image/svg+xml"
      }
    ]
  }
};

// Aplica el tema desde localStorage antes de pintar, evitando el flash de color.
// Perfiles de comprador: blue (N1) / gold (N2) / platinium (N3) / black (N4).
// Vendedores: seller. Sin sesión => blue.
const themeInit = `
try {
  var u = JSON.parse(localStorage.getItem('itm_user') || 'null');
  var t = 'blue';
  if (u) { t = u.type === 'seller' ? 'seller' : (u.tier || 'blue'); }
  document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="blue">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <StoreProvider>
          <div className="md-app">
            <Header />
            <main className="md-main">{children}</main>
            <Footer />
            <VirtualAssistant />
            <CompareBar />
            <Toaster />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
