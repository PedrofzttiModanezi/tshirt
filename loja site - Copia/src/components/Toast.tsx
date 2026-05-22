"use client";

import { useCart } from "@/context/CartProvider";

export function Toast() {
  const { toast } = useCart();
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast-pop pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2"
    >
      <div className="rounded-full border border-sky-400/40 bg-[#0f172a] px-5 py-2.5 text-sm text-white shadow-lg shadow-black/50 ring-1 ring-white/10">
        {toast.message}
      </div>
    </div>
  );
}
