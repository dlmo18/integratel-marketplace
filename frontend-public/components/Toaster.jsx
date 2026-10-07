"use client";

import { useStore } from "@/context/StoreContext";

// Estilos por tipo de toast.
const styles = {
  success: "border-movistar-green/30 bg-white",
  info: "border-movistar-blue/30 bg-white",
  error: "border-red-300 bg-white"
};

const defaultIcon = {
  success: "✓",
  info: "ℹ️",
  error: "⚠️"
};

// Pila de notificaciones efímeras. Se alimenta de store.toasts y permite
// cerrarlas manualmente antes de que expiren.
export default function Toaster() {
  const { toasts, removeToast } = useStore();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:w-80"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-card ring-1 ring-black/5 ${
            styles[t.type] || styles.success
          } animate-[toastIn_.2s_ease-out]`}
        >
          <span className="text-lg leading-none">
            {t.icon || defaultIcon[t.type] || "✓"}
          </span>
          <p className="flex-1 text-sm font-medium text-movistar-navy">
            {t.message}
          </p>
          <button
            onClick={() => removeToast(t.id)}
            className="text-movistar-gray-med hover:text-movistar-navy"
            aria-label="Cerrar notificación"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
