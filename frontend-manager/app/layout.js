import "./globals.css";

export const metadata = {
  title: "Integratel Manager",
  description: "Panel administrador del marketplace (demo · solo login)."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
