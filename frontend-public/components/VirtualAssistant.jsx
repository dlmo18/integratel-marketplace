"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

const welcomeFor = (name) =>
  `¡Hola! Soy ${name}, tu agente de ventas de Movistar 🛍️ Puedo ayudarte a encontrar productos, comprar o vender en el marketplace. ¿Qué buscas hoy?`;

const soles = (n) => `S/ ${Number(n).toLocaleString("es-PE")}`;

export default function VirtualAssistant() {
  const [open, setOpen] = useState(false);
  const [agentName, setAgentName] = useState("Asistente");
  const [messages, setMessages] = useState([
    { from: "bot", text: welcomeFor("Asistente") }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("chat");
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const scrollRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/chat/config`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data?.agentName) return;
        setAgentName(data.agentName);
        setMessages((m) =>
          m.length === 1 && m[0].from === "bot"
            ? [{ from: "bot", text: welcomeFor(data.agentName) }]
            : m
        );
      } catch (e) {
        // sin backend: se queda con "Asistente"
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading, mode, step]);

  const pushBot = (text, extra = {}) =>
    setMessages((m) => [...m, { from: "bot", text, ...extra }]);
  const pushUser = (text) => setMessages((m) => [...m, { from: "user", text }]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    pushUser(text);
    setInput("");
    setLoading(true);

    const history = messages
      .filter((m) => m.text)
      .map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text
      }));

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      pushBot(data.reply || "No pude responder en este momento.");
    } catch (err) {
      pushBot(
        "No pude conectarme con el asistente. Verifica que el backend esté corriendo (puerto 3002) e intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const startProfiling = async () => {
    if (loading) return;
    setLoading(true);
    pushUser("Quiero que me recomienden un producto");
    try {
      const res = await fetch(`${API_BASE}/chat/profile/questions`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const qs = data.questions || [];
      if (!qs.length) throw new Error("sin preguntas");
      setQuestions(qs);
      setAnswers({});
      setStep(0);
      setMode("profile");
      pushBot(
        "¡Genial! Te haré unas preguntas rápidas para conocerte mejor y recomendarte lo ideal. 👇"
      );
    } catch (err) {
      pushBot(
        "No pude iniciar el cuestionario. Verifica que el backend esté activo (puerto 3002)."
      );
    } finally {
      setLoading(false);
    }
  };

  const answer = async (option) => {
    if (loading) return;
    const current = questions[step];
    const nextAnswers = { ...answers, [current.id]: option.value };
    setAnswers(nextAnswers);
    pushUser(option.label);

    const isLast = step >= questions.length - 1;
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

    setMode("chat");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/chat/profile/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      pushBot(data.message || "Estas son mis recomendaciones para ti:", {
        products: data.products || []
      });
    } catch (err) {
      pushBot("No pude generar las recomendaciones. Intenta de nuevo en unos momentos.");
    } finally {
      setLoading(false);
      setQuestions([]);
      setStep(0);
    }
  };

  const cancelProfiling = () => {
    setMode("chat");
    setQuestions([]);
    setStep(0);
    pushBot("Sin problema. Si quieres, cuéntame qué buscas y te ayudo. 🙂");
  };

  const currentQuestion = mode === "profile" ? questions[step] : null;

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="assistant-fab md-state"
        aria-label="Asistente virtual"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 26 }}>
          {open ? "close" : "chat"}
        </span>
      </button>

      {open && (
        <div className="assistant-panel">
          <div className="assistant-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/avatars/ia-avatar.png"
              alt={agentName}
              style={{ height: 36, width: 36, borderRadius: "50%", objectFit: "cover", background: "rgba(255,255,255,0.2)" }}
            />
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700 }}>
                Agente {agentName}
              </p>
              <p style={{ margin: 0, fontSize: "0.65rem", opacity: 0.8 }}>
                Ventas · IA en línea
              </p>
            </div>
          </div>

          <div ref={scrollRef} className="assistant-body">
            {messages.map((m, i) => (
              <div key={i} className="md-col" style={{ gap: 8 }}>
                <div className={`assistant-msg ${m.from === "user" ? "user" : "bot"}`}>
                  {m.text}
                </div>

                {m.products && m.products.length > 0 && (
                  <div className="md-col" style={{ gap: 8 }}>
                    {m.products.map((p) => (
                      <a
                        key={p.id}
                        href={`/producto/${p.slug}`}
                        className="md-card md-card-elevated md-row"
                        style={{ gap: 12, padding: 8 }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} style={{ height: 56, width: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                        <div className="md-grow" style={{ minWidth: 0 }}>
                          <p className="md-body-medium" style={{ margin: 0, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {p.name}
                          </p>
                          <p className="md-primary-text" style={{ margin: 0, fontWeight: 700 }}>{soles(p.price)}</p>
                          <p className="md-muted" style={{ margin: 0, fontSize: "0.7rem" }}>⭐ {p.rating} · {p.reason}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="assistant-msg bot">{agentName} está escribiendo…</div>
            )}

            {currentQuestion && !loading && (
              <div className="md-card md-card-elevated md-card-pad-sm">
                <p className="md-label-medium md-muted" style={{ margin: 0 }}>
                  Pregunta {step + 1} de {questions.length}
                </p>
                <p className="md-title-small" style={{ margin: "4px 0 8px" }}>
                  {currentQuestion.question}
                </p>
                <div className="md-row md-wrap" style={{ gap: 8 }}>
                  {currentQuestion.options.map((opt) => (
                    <button key={opt.value} onClick={() => answer(opt)} className="md-chip md-state">
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button onClick={cancelProfiling} className="md-btn md-btn-text md-btn-sm" style={{ marginTop: 8 }}>
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="assistant-foot">
            {mode === "chat" && !loading && (
              <button onClick={startProfiling} className="md-btn md-btn-tonal md-btn-block md-btn-sm md-state">
                ✨ Encontrar mi producto ideal
              </button>
            )}
            <form onSubmit={send} className="md-row" style={{ gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "profile" ? "Responde las opciones de arriba…" : "Escribe un mensaje..."}
                className="md-input"
                style={{ borderRadius: "var(--md-shape-full)", borderBottom: "none", background: "var(--md-surface-container-high)" }}
                disabled={loading || mode === "profile"}
              />
              <button type="submit" className="md-btn md-btn-filled md-state" disabled={loading || mode === "profile"} aria-label="Enviar">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
