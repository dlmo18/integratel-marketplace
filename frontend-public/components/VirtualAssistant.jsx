"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

const welcomeFor = (name) =>
  `¡Hola! Soy ${name}, tu agente de ventas de Integratel 🛍️ Puedo ayudarte a encontrar productos, comprar o vender en el marketplace. ¿Qué buscas hoy?`;

export default function VirtualAssistant() {
  const [open, setOpen] = useState(false);
  const [agentName, setAgentName] = useState("Asistente");
  const [messages, setMessages] = useState([
    { from: "bot", text: welcomeFor("Asistente") }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const nameLoaded = useRef(false);

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
        // Actualiza el saludo solo si el usuario aún no interactuó.
        setMessages((m) =>
          m.length === 1 && m[0].from === "bot"
            ? [{ from: "bot", text: welcomeFor(data.agentName) }]
            : m
        );
        nameLoaded.current = true;
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
  }, [messages, loading]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { from: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    // Historial en el formato que espera el backend.
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
      setMessages((m) => [
        ...m,
        { from: "bot", text: data.reply || "No pude responder en este momento." }
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text:
            "No pude conectarme con el asistente. Verifica que el backend esté corriendo (puerto 3002) e intenta de nuevo."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
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
              <div
                key={i}
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
            ))}
            {loading && (
              <div className="flex justify-start">
                <span className="rounded-2xl bg-white px-3 py-2 text-sm text-movistar-gray-med shadow">
                  {agentName} está escribiendo…
                </span>
              </div>
            )}
          </div>

          <form onSubmit={send} className="flex gap-2 border-t p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="input"
              disabled={loading}
            />
            <button type="submit" className="btn-primary px-4" disabled={loading}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
