"use client";

import Link from "next/link";

function CategoryCard({ cat }) {
  return (
    <Link
      href={`/catalogo?categoria=${cat.slug}`}
      className="group relative block h-64 w-72 shrink-0 overflow-hidden rounded-2xl shadow-card sm:w-80"
    >
      {/* Imagen de fondo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cat.image}
        alt={cat.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      {/* Degradado para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-movistar-navy/90 via-movistar-navy/30 to-transparent" />
      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
        <span className="mb-1 text-3xl drop-shadow">{cat.icon}</span>
        <h3 className="text-xl font-bold drop-shadow">{cat.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/80">
          {cat.description}
        </p>
        <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm transition-colors group-hover:bg-movistar-blue">
          Ver productos →
        </span>
      </div>
    </Link>
  );
}

export default function CategoryCarousel({ categories }) {
  // Duplicamos la lista para lograr el loop infinito sin saltos.
  const loop = [...categories, ...categories];

  return (
    <div
      className="group/marquee relative overflow-hidden"
      // máscara para desvanecer los bordes
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 5%, black 95%, transparent)"
      }}
    >
      <div className="animate-marquee flex w-max gap-5 py-2 group-hover/marquee:[animation-play-state:paused]">
        {loop.map((cat, i) => (
          <CategoryCard key={`${cat.id}-${i}`} cat={cat} />
        ))}
      </div>
    </div>
  );
}
