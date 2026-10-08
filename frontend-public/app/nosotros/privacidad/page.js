import Lorem from "@/components/Lorem";

export const metadata = { title: "Políticas de privacidad · Movistar" };

export default function PrivacidadPage() {
  return (
    <div>
      <h1 className="md-headline-small" style={{ marginBottom: 16 }}>Políticas de privacidad</h1>
      <Lorem
        sections={[
          "Datos que recopilamos",
          "Uso de la información",
          "Cookies y tecnologías similares",
          "Tus derechos"
        ]}
      />
    </div>
  );
}
