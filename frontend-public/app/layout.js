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
    "Marketplace Movistar: equipos, accesorios, servicios digitales y productos de sellers."
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
