import DemoForm from "@/components/DemoForm";

export const metadata = { title: "Contáctanos · Integratel" };

export default function ContactPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="mb-3 text-2xl font-bold text-movistar-navy">Contáctanos</h1>
        <p className="text-movistar-gray-med">
          ¿Tienes dudas o consultas? Escríbenos y te responderemos a la brevedad.
        </p>
        <ul className="mt-6 space-y-3 text-sm">
          <li>📞 (01) 555 1234</li>
          <li>✉️ soporte@integratel.demo</li>
          <li>📍 Av. Arequipa 4545, Miraflores, Lima</li>
          <li>🕘 Lun a Sáb de 9:00 a 18:00</li>
        </ul>
      </div>
      <DemoForm
        fields={[
          { name: "nombre", label: "Nombre completo", required: true, placeholder: "Tu nombre" },
          { name: "email", label: "Correo electrónico", type: "email", required: true, placeholder: "tu@correo.com" },
          { name: "asunto", label: "Asunto", type: "select", options: ["Consulta general", "Problema con un pedido", "Facturación", "Otro"] },
          { name: "mensaje", label: "Mensaje", type: "textarea", required: true, placeholder: "Cuéntanos en qué podemos ayudarte" }
        ]}
        submitLabel="Enviar mensaje"
        successMessage="¡Mensaje enviado!"
      />
    </div>
  );
}
