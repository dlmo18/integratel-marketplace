import Lorem from "@/components/Lorem";

export const metadata = { title: "Términos y condiciones · Integratel" };

export default function TerminosPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-movistar-navy">
        Términos y condiciones
      </h1>
      <Lorem
        sections={[
          "1. Aceptación de los términos",
          "2. Uso de la plataforma",
          "3. Compras y pagos",
          "4. Responsabilidades del usuario",
          "5. Limitación de responsabilidad"
        ]}
      />
    </div>
  );
}
