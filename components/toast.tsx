"use client";

import { useEffect, useCallback, useRef, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

let toastId = 0;
let addToastFn: ((text: string, type: ToastType) => void) | null = null;

export function showToast(text: string, type: ToastType = "info") {
  if (addToastFn) {
    addToastFn(text, type);
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const addToast = useCallback((text: string, type: ToastType) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, text, type }]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, 4000);
    timers.current.set(id, timer);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  if (toasts.length === 0) return null;

  const bgMap: Record<ToastType, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  const iconMap: Record<ToastType, string> = {
    success: "fa-circle-check",
    error: "fa-circle-exclamation",
    info: "fa-circle-info",
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${bgMap[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm animate-fade-in`}
        >
          <i className={`fa-solid ${iconMap[toast.type]}`} />
          <span>{toast.text}</span>
          <button
            onClick={() => {
              setToasts((prev) => prev.filter((t) => t.id !== toast.id));
              const timer = timers.current.get(toast.id);
              if (timer) clearTimeout(timer);
              timers.current.delete(toast.id);
            }}
            className="ml-auto text-white/70 hover:text-white"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      ))}
    </div>
  );
}
