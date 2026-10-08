import Link from "next/link";

export default function CategoryCarousel({ categories = [] }) {
  return (
    <div className="cat-scroller">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categoria/${cat.slug}`}
          className="cat-card md-state"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cat.image} alt={cat.name} />
          <div className="overlay" />
          <div className="content">
            <span className="icon">{cat.icon}</span>
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
            <span className="chip">Ver productos →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
