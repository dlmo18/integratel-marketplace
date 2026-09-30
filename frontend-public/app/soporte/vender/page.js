import Link from "next/link";
import DemoForm from "@/components/DemoForm";

export const metadata = { title: "Vender en el marketplace · Integratel" };

export default function SellPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="mb-3 text-2xl font-bold text-movistar-navy">
          Vende en el marketplace
        </h1>
        <p className="text-movistar-gray-med">
          Únete a nuestra comunidad de sellers y llega a miles de clientes.
          Déjanos tus datos y un asesor te contactará, o crea tu cuenta de
          seller directamente.
        </p>
        <ul className="mt-6 space-y-3 text-sm">
          <li className="rounded-lg bg-movistar-gray p-3">💰 Comisiones competitivas</li>
          <li className="rounded-lg bg-movistar-gray p-3">📦 Herramientas de gestión de stock</li>
          <li className="rounded-lg bg-movistar-gray p-3">📊 Dashboard de ventas y pagos</li>
        </ul>
        <Link href="/registro?tipo=seller" className="btn-green mt-6">
          Crear cuenta de Seller
        </Link>
      </div>
      <DemoForm
        fields={[
          { name: "empresa", label: "Nombre de tu negocio", required: true, placeholder: "Mi tienda" },
          { name: "contacto", label: "Nombre de contacto", required: true, placeholder: "Tu nombre" },
          { name: "email", label: "Correo electrónico", type: "email", required: true, placeholder: "tu@correo.com" },
          { name: "rubro", label: "Rubro", type: "select", options: ["Tecnología", "Hogar", "Moda", "Deportes", "Belleza", "Juguetes", "Otro"] },
          { name: "mensaje", label: "Cuéntanos sobre tus productos", type: "textarea", placeholder: "¿Qué vendes?" }
        ]}
        submitLabel="Quiero vender"
        successMessage="¡Gracias! Te contactaremos pronto."
      />
    </div>
  );
}
