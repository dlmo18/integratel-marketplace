"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

const welcomeFor = (name) =>
  `¡Hola! Soy ${name}, tu agente de ventas de Integratel 🛍️ Puedo ayudarte a encontrar productos, comprar o vender en el marketplace. ¿Qué buscas hoy?`;

// Formatea montos en soles.
const soles = (n) => `S/ ${Number(n).toLocaleString("es-PE")}`;

export default function VirtualAssistant() {
  const [open, setOpen] = useState(false);
  const [agentName, setAgentName] = useState("Asistente");
  const [messages, setMessages] = useState([
    { from: "bot", text: welcomeFor("Asistente") }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== Estado del perfilador =====
  // mode: "chat" | "profile"
  const [mode, setMode] = useState("chat");
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const scrollRef = useRef(null);

  // Obtiene el nombre del agente desde el backend (definido en AI_SYSTEM_NAME).
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

  // ===== Chat normal =====
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

  // ===== Perfilador =====
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

    // Última respuesta: pide recomendación.
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
      pushBot(
        "No pude generar las recomendaciones. Intenta de nuevo en unos momentos."
      );
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
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-movistar-blue text-2xl text-white shadow-lg transition-transform hover:scale-105"
        aria-label="Asistente virtual"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[32rem] w-[22rem] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center gap-2 bg-movistar-navy p-4 text-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/avatars/ia-avatar.png"
              alt={agentName}
              className="h-9 w-9 rounded-full bg-movistar-blue object-cover"
            />
            <div>
              <p className="text-sm font-bold">Agente {agentName}</p>
              <p className="text-[10px] text-white/70">Ventas · IA en línea</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-movistar-gray p-4">
            {messages.map((m, i) => (
              <div key={i} className="space-y-2">
                <div
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <span
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                      m.from === "user"
                        ? "bg-movistar-blue text-white"
                        : "bg-white text-movistar-navy shadow"
                    }`}
                  >
                    {m.text}
                  </span>
                </div>

                {/* Tarjetas de productos recomendados */}
                {m.products && m.products.length > 0 && (
                  <div className="space-y-2">
                    {m.products.map((p) => (
                      <a
                        key={p.id}
                        href={`/producto/${p.slug}`}
                        className="flex gap-3 rounded-xl bg-white p-2 shadow transition hover:shadow-md"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-movistar-navy">
                            {p.name}
                          </p>
                          <p className="text-sm font-bold text-movistar-blue">
                            {soles(p.price)}
                          </p>
                          <p className="truncate text-[11px] text-movistar-gray-med">
                            ⭐ {p.rating} · {p.reason}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <span className="rounded-2xl bg-white px-3 py-2 text-sm text-movistar-gray-med shadow">
                  {agentName} está escribiendo…
                </span>
              </div>
            )}

            {/* Panel de pregunta del perfilador */}
            {currentQuestion && !loading && (
              <div className="rounded-2xl bg-white p-3 shadow">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-movistar-gray-med">
                  Pregunta {step + 1} de {questions.length}
                </p>
                <p className="mb-2 text-sm font-semibold text-movistar-navy">
                  {currentQuestion.question}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => answer(opt)}
                      className="rounded-full border border-movistar-blue px-3 py-1 text-xs font-medium text-movistar-blue transition hover:bg-movistar-blue hover:text-white"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={cancelProfiling}
                  className="mt-2 text-[11px] text-movistar-gray-med underline"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Barra inferior: CTA del perfilador + input de chat */}
          <div className="border-t">
            {mode === "chat" && !loading && (
              <div className="px-3 pt-2">
                <button
                  onClick={startProfiling}
                  className="w-full rounded-full bg-movistar-green/10 px-3 py-2 text-xs font-semibold text-movistar-green transition hover:bg-movistar-green/20"
                >
                  ✨ Encontrar mi producto ideal
                </button>
              </div>
            )}
            <form onSubmit={send} className="flex gap-2 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === "profile"
                    ? "Responde las opciones de arriba…"
                    : "Escribe un mensaje..."
                }
                className="input"
                disabled={loading || mode === "profile"}
              />
              <button
                type="submit"
                className="btn-primary px-4"
                disabled={loading || mode === "profile"}
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
