import Lorem from "@/components/Lorem";

export const metadata = { title: "Términos y condiciones · Movistar" };

export default function TerminosPage() {
  return (
    <div>
      <h1 className="md-headline-small" style={{ marginBottom: 16 }}>Términos y condiciones</h1>
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
