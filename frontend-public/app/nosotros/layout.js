import PageHeader from "@/components/PageHeader";
import AboutTabs from "@/components/AboutTabs";

export default function NosotrosLayout({ children }) {
  return (
    <div>
      <PageHeader
        title="Nosotros"
        subtitle="Conoce más sobre Integratel Marketplace y nuestras políticas."
      />
      <div className="container-page py-8">
        <AboutTabs />
        <div className="py-8">{children}</div>
      </div>
    </div>
  );
}
