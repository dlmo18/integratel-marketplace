"use client";

import { useStore } from "@/context/StoreContext";

const iconFor = {
  success: "check_circle",
  info: "info",
  error: "warning"
};

// Pila de notificaciones efímeras alimentada por store.toasts.
export default function Toaster() {
  const { toasts, removeToast } = useStore();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toaster" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} role="status" className="toast">
          {t.icon ? (
            <span style={{ fontSize: 18 }}>{t.icon}</span>
          ) : (
            <span className="material-symbols-outlined filled">
              {iconFor[t.type] || "check_circle"}
            </span>
          )}
          <span style={{ flex: 1, fontSize: "0.875rem" }}>{t.message}</span>
          <button onClick={() => removeToast(t.id)} aria-label="Cerrar notificación">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              close
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
