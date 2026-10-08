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

  useEffect(() => {
    if (count <= 1) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setActive((a) => (a + 1) % count),
      autoplayMs
    );
    return () => clearTimeout(timer.current);
  }, [active, count, autoplayMs]);

  if (count === 0) return null;

  return (
    <section className="hero">
      <div className="hero-slides">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`hero-slide ${i === active ? "active" : "inactive"}`}
            aria-hidden={i !== active}
          >
            <div className="md-container">
              <div className="hero-grid">
                <div>
                  {s.badge && (
                    <span className="md-badge md-badge-secondary">{s.badge}</span>
                  )}
                  <h1 className="md-display-small">
                    {s.titleLine1} <br />
                    <span className="hl">{s.titleHighlight}</span>
                  </h1>
                  <p className="md-body-large">{s.text}</p>
                  <div className="hero-ctas">
                    {s.primaryCta && (
                      <Link href={s.primaryCta.href} className="md-btn md-btn-on-dark md-state">
                        {s.primaryCta.label}
                      </Link>
                    )}
                    {s.secondaryCta && (
                      <Link href={s.secondaryCta.href} className="md-btn md-btn-outlined-on-dark md-state">
                        {s.secondaryCta.label}
                      </Link>
                    )}
                  </div>
                </div>
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="hero-img"
                    src={s.image}
                    alt={s.titleHighlight || s.titleLine1}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="md-container">
          <div className="hero-bullets">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => go(i)}
                aria-label={`Ir al slide ${i + 1}`}
                aria-current={i === active}
                className={`hero-bullet ${i === active ? "on" : ""}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
