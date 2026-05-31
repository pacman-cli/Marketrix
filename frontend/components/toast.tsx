"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

type Toast = { id: number; message: string; type: "success" | "error" };

const ToastContext = createContext<{
  success: (msg: string) => void;
  error: (msg: string) => void;
}>({ success: () => {}, error: () => {} });

export const useToast = () => useContext(ToastContext);

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((message: string, type: Toast["type"]) => {
    const id = nextId++;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const success = useCallback((msg: string) => add(msg, "success"), [add]);
  const error = useCallback((msg: string) => add(msg, "error"), [add]);
  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] grid gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm animate-in slide-in-from-right ${
              toast.type === "error"
                ? "border-red-500/20 bg-red-500/10 text-red-300"
                : "border-[var(--emerald-border)] bg-[var(--emerald-surface)] text-[var(--emerald)]"
            }`}
          >
            {toast.type === "error" ? <AlertCircle size={16} className="mt-0.5 shrink-0" /> : <CheckCircle size={16} className="mt-0.5 shrink-0" />}
            <p className="text-sm flex-1">{toast.message}</p>
            <button type="button" onClick={() => dismiss(toast.id)} className="shrink-0 opacity-60 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
