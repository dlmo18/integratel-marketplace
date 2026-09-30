import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VirtualAssistant from "@/components/VirtualAssistant";

export const metadata = {
  title: "Integratel Marketplace",
  description:
    "Marketplace piloto estilo Movistar: equipos, accesorios y productos de sellers.",
};

// Aplica el tema desde localStorage antes de pintar, evitando el flash de color.
const themeInit = `
try {
  var u = JSON.parse(localStorage.getItem('itm_user') || 'null');
  var t = u ? (u.tier || (u.type === 'seller' ? 'seller' : 'regular')) : 'regular';
  document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="regular">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <VirtualAssistant />
        </StoreProvider>
      </body>
    </html>
  );
}
