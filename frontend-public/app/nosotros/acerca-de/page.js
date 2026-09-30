import Lorem from "@/components/Lorem";

export const metadata = { title: "Acerca de · Integratel" };

export default function AcercaDePage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-movistar-navy">Acerca de nosotros</h1>
      <Lorem
        sections={["Nuestra misión", "Nuestra visión", "Nuestros valores", "Nuestro equipo"]}
      />
    </div>
  );
}
