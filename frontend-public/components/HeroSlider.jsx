"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function HeroSlider({ slides = [], autoplayMs = 6000 }) {
  const [active, setActive] = useState(0);
  const timer = useRef(null);
  const count = slides.length;

  const go = useCallback(
    (i) => setActive(((i % count) + count) % count),
    [count]
  );

  // Autoplay con reinicio del temporizador en cada cambio.
  useEffect(() => {
    if (count <= 1) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive((a) => (a + 1) % count), autoplayMs);
    return () => clearTimeout(timer.current);
  }, [active, count, autoplayMs]);

  if (count === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-movistar-navy via-movistar-navy to-movistar-blue text-white">
      {/* Slides apilados con crossfade */}
      <div className="relative">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`transition-opacity duration-700 ease-in-out ${
              i === active
                ? "relative opacity-100"
                : "pointer-events-none absolute inset-0 opacity-0"
            }`}
            aria-hidden={i !== active}
          >
            <div className="container-page grid items-center gap-8 py-14 lg:grid-cols-2">
              <div>
                {s.badge && (
                  <span className="badge bg-movistar-green text-white">
                    {s.badge}
                  </span>
                )}
                <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                  {s.titleLine1} <br />
                  <span className="text-movistar-blue">{s.titleHighlight}</span>
                </h1>
                <p className="mt-4 max-w-md text-white/80">{s.text}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {s.primaryCta && (
                    <Link href={s.primaryCta.href} className="btn-primary">
                      {s.primaryCta.label}
                    </Link>
                  )}
                  {s.secondaryCta && (
                    <Link
                      href={s.secondaryCta.href}
                      className="btn-outline border-white text-white hover:bg-white hover:text-movistar-navy"
                    >
                      {s.secondaryCta.label}
                    </Link>
                  )}
                </div>
              </div>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.titleHighlight || s.titleLine1}
                  className="h-64 w-full rounded-3xl object-cover shadow-2xl sm:h-80 lg:h-[22rem]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bullets de control */}
      {count > 1 && (
        <div className="container-page relative -mt-4 flex justify-center gap-2 pb-6 lg:justify-start">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              aria-label={`Ir al slide ${i + 1}`}
              aria-current={i === active}
              className={`h-2.5 rounded-full transition-all ${
                i === active
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
