export default function PageHeader({ title, subtitle }) {
  return (
    <div className="bg-movistar-navy py-12 text-white">
      <div className="container-page">
        <h1 className="text-3xl font-black sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-white/80">{subtitle}</p>}
      </div>
    </div>
  );
}
