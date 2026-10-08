import PageHeader from "@/components/PageHeader";
import SupportTabs from "@/components/SupportTabs";

export default function SoporteLayout({ children }) {
  return (
    <div>
      <PageHeader
        title="Soporte"
        subtitle="Estamos para ayudarte. Elige una opción para continuar."
      />
      <div className="md-container md-page">
        <SupportTabs />
        <div>{children}</div>
      </div>
    </div>
  );
}
