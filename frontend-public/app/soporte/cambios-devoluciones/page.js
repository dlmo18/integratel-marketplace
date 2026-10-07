import DemoForm from "@/components/DemoForm";

export const metadata = { title: "Cambios y devoluciones · Integratel" };

export default function ReturnsPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="mb-3 text-2xl font-bold text-movistar-navy">
          Cambios y devoluciones
        </h1>
        <p className="text-movistar-gray-med">
          Solicita el cambio o devolución de tu producto dentro de los 30 días
          posteriores a la compra. Completa el formulario y nuestro equipo
          revisará tu caso.
        </p>
        <div className="mt-6 space-y-3 text-sm text-movistar-gray-med">
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
