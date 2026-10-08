import DemoForm from "@/components/DemoForm";

export const metadata = { title: "Cambios y devoluciones · Movistar" };

export default function ReturnsPage() {
  return (
    <div style={{ display: "grid", gap: 32, gridTemplateColumns: "1fr" }} className="gc-layout">
      <div>
        <h1 className="md-headline-small" style={{ marginBottom: 12 }}>Cambios y devoluciones</h1>
        <p className="md-muted">
          Solicita el cambio o devolución de tu producto dentro de los 30 días
          posteriores a la compra. Completa el formulario y nuestro equipo revisará tu caso.
        </p>
        <div className="md-muted md-body-medium" style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <p>✅ El producto debe estar en su empaque original.</p>
          <p>✅ Adjunta el número de pedido.</p>
          <p>✅ Reembolso en un plazo de 5 a 7 días hábiles.</p>
        </div>
      </div>
      <DemoForm
        fields={[
          { name: "pedido", label: "Número de pedido", required: true, placeholder: "ORD-2026-0001" },
          { name: "email", label: "Correo de la compra", type: "email", required: true, placeholder: "tu@correo.com" },
          { name: "tipo", label: "Tipo de solicitud", type: "select", options: ["Cambio de producto", "Devolución y reembolso", "Producto defectuoso"] },
          { name: "motivo", label: "Motivo", type: "textarea", required: true, placeholder: "Describe el motivo de tu solicitud" }
        ]}
        submitLabel="Solicitar"
        successMessage="¡Solicitud registrada!"
      />
    </div>
  );
}
