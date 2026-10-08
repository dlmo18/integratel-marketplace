import DemoForm from "@/components/DemoForm";

export const metadata = { title: "Contáctanos · Movistar" };

export default function ContactPage() {
  return (
    <div style={{ display: "grid", gap: 32, gridTemplateColumns: "1fr" }} className="gc-layout">
      <div>
        <h1 className="md-headline-small" style={{ marginBottom: 12 }}>Contáctanos</h1>
        <p className="md-muted">
          ¿Tienes dudas o consultas? Escríbenos y te responderemos a la brevedad.
        </p>
        <ul style={{ listStyle: "none", margin: "24px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: "0.9rem" }}>
          <li>📞 (01) 555 1234</li>
          <li>✉️ soporte@movistar.demo</li>
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
