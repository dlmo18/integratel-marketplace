import Lorem from "@/components/Lorem";

export const metadata = { title: "Políticas de Sellers · Integratel" };

export default function SellersPolicyPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-movistar-navy">
        Políticas de Sellers
      </h1>
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
