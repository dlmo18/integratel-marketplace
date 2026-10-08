import PageHeader from "@/components/PageHeader";
import AboutTabs from "@/components/AboutTabs";

export default function NosotrosLayout({ children }) {
  return (
    <div>
      <PageHeader
        title="Nosotros"
        subtitle="Conoce más sobre Movistar Marketplace y nuestras políticas."
      />
      <div className="md-container md-page">
        <AboutTabs />
        <div>{children}</div>
      </div>
    </div>
  );
}
