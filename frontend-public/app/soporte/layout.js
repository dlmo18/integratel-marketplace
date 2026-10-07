import PageHeader from "@/components/PageHeader";
import SupportTabs from "@/components/SupportTabs";

export default function SoporteLayout({ children }) {
  return (
    <div>
      <PageHeader
        title="Soporte"
        subtitle="Estamos para ayudarte. Elige una opción para continuar."
      />
      <div className="container-page py-8">
        <SupportTabs />
        <div className="py-8">{children}</div>
      </div>
    </div>
  );
}
