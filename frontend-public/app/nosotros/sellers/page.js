import Lorem from "@/components/Lorem";

export const metadata = { title: "Políticas de Sellers · Movistar" };

export default function SellersPolicyPage() {
  return (
    <div>
      <h1 className="md-headline-small" style={{ marginBottom: 16 }}>Políticas de Sellers</h1>
      <Lorem
        sections={[
          "Requisitos para vender",
          "Comisiones y payouts",
          "Gestión de productos y stock",
          "Envíos y devoluciones",
          "Suspensión de cuentas"
        ]}
      />
    </div>
  );
}
