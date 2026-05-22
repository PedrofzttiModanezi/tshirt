"use client";

import { useCart } from "@/context/CartProvider";

export function Header() {
  const { itemCount, setCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060b14]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex flex-col">
          <span
            style={{ fontFamily: "var(--font-display), system-ui" }}
            className="text-2xl tracking-tight text-white sm:text-3xl"
          >
            STREET DROP
          </span>
          <span className="text-xs uppercase tracking-[0.25em] text-sky-300/80">
            camisetas · vibe urbana
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="group relative flex items-center gap-2 rounded-full border border-white/15 bg-[#0c1424] px-4 py-2 text-sm font-medium text-white transition hover:border-sky-400/50 hover:bg-[#111d33]"
        >
          <span aria-hidden>🛒</span>
          Carrinho
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 text-[11px] font-bold text-[#060b14]">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
