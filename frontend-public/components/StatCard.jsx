export default function StatCard({ label, value, icon, accent = "blue" }) {
  const colors = {
    blue: "bg-movistar-blue/10 text-movistar-blue",
    green: "bg-movistar-green/10 text-movistar-green",
    navy: "bg-movistar-navy/10 text-movistar-navy"
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${colors[accent]}`}>
        {icon}
      </span>
      <div>
        <p className="text-sm text-movistar-gray-med">{label}</p>
        <p className="text-2xl font-bold text-movistar-navy">{value}</p>
      </div>
    </div>
  );
}
