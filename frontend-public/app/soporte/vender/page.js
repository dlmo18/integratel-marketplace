import Link from "next/link";
import DemoForm from "@/components/DemoForm";

export const metadata = { title: "Vender en el marketplace · Movistar" };

export default function SellPage() {
  return (
    <div style={{ display: "grid", gap: 32, gridTemplateColumns: "1fr" }} className="gc-layout">
      <div>
        <h1 className="md-headline-small" style={{ marginBottom: 12 }}>Vende en el marketplace</h1>
        <p className="md-muted">
          Únete a nuestra comunidad de sellers y llega a miles de clientes.
          Déjanos tus datos y un asesor te contactará, o crea tu cuenta de seller directamente.
        </p>
        <ul style={{ listStyle: "none", margin: "24px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: "0.9rem" }}>
          <li className="md-card md-card-filled md-card-pad-sm">💰 Comisiones competitivas</li>
          <li className="md-card md-card-filled md-card-pad-sm">📦 Herramientas de gestión de stock</li>
          <li className="md-card md-card-filled md-card-pad-sm">📊 Dashboard de ventas y pagos</li>
        </ul>
        <Link href="/registro?tipo=seller" className="md-btn md-btn-green md-state" style={{ marginTop: 24 }}>
          Crear cuenta de Seller
        </Link>
      </div>
      <DemoForm
        fields={[
          { name: "empresa", label: "Nombre de tu negocio", required: true, placeholder: "Mi tienda" },
          { name: "contacto", label: "Nombre de contacto", required: true, placeholder: "Tu nombre" },
          { name: "email", label: "Correo electrónico", type: "email", required: true, placeholder: "tu@correo.com" },
          { name: "rubro", label: "Rubro", type: "select", options: ["Tecnología", "Hogar", "Over-The-Top", "Deportes", "Servicios digitales", "Juguetes", "Otro"] },
          { name: "mensaje", label: "Cuéntanos sobre tus productos", type: "textarea", placeholder: "¿Qué vendes?" }
        ]}
        submitLabel="Quiero vender"
        successMessage="¡Gracias! Te contactaremos pronto."
      />
    </div>
  );
}
