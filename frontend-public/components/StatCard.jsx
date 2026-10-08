export default function StatCard({ label, value, icon, accent = "primary" }) {
  const accents = {
    primary: { bg: "color-mix(in srgb, var(--md-primary) 12%, transparent)", fg: "var(--md-primary)" },
    secondary: { bg: "color-mix(in srgb, var(--md-secondary) 14%, transparent)", fg: "var(--md-secondary)" },
    tertiary: { bg: "color-mix(in srgb, var(--md-tertiary) 14%, transparent)", fg: "var(--md-tertiary)" }
  };
  const a = accents[accent] || accents.primary;
  return (
    <div className="md-card md-card-elevated md-row" style={{ gap: 16, padding: 20 }}>
      <span
        style={{
          display: "inline-flex",
          height: 48,
          width: 48,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--md-shape-md)",
          fontSize: "1.6rem",
          background: a.bg,
          color: a.fg
        }}
      >
        {icon}
      </span>
      <div>
        <p className="md-muted md-body-medium" style={{ margin: 0 }}>{label}</p>
        <p className="md-headline-small" style={{ margin: 0, fontWeight: 700 }}>{value}</p>
      </div>
    </div>
  );
}
