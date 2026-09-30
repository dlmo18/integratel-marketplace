import Lorem from "@/components/Lorem";

export const metadata = { title: "Políticas de privacidad · Integratel" };

export default function PrivacidadPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-movistar-navy">
        Políticas de privacidad
      </h1>
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
