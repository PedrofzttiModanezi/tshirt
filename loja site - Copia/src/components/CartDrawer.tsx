"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { useCart } from "@/context/CartProvider";

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function CartDrawer() {
  const {
    lines,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeLine,
    subtotalCents,
    clearCart,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = useCallback(async () => {
    if (lines.length === 0) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            model: l.model,
            priceCents: l.priceCents,
            quantity: l.quantity,
          })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Não foi possível iniciar o pagamento.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Erro de rede. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }, [lines]);

  if (!cartOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Fechar carrinho"
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-[#0a1020] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2
            id="cart-title"
            style={{ fontFamily: "var(--font-display), system-ui" }}
            className="text-2xl text-white"
          >
            Carrinho
          </h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="text-center text-white/50">
              Seu carrinho tá vazio. Bora escolher uma camiseta?
            </p>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li
                  key={line.productId}
                  className="flex gap-3 rounded-xl border border-white/10 bg-[#0f172a] p-3"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#0c1424]">
                    {line.imageUrl ? (
                      <Image
                        src={line.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl opacity-50">
                        👕
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{line.name}</p>
                    <p className="truncate text-xs text-sky-300/80">{line.model}</p>
                    <p className="mt-1 text-sm text-white/80">
                      {formatBRL(line.priceCents)} · unidade
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <label className="sr-only" htmlFor={`qty-${line.productId}`}>
                        Quantidade
                      </label>
                      <div className="flex items-center rounded-full border border-white/20 bg-[#060b14]">
                        <button
                          type="button"
                          className="px-3 py-1 text-lg leading-none text-white hover:bg-white/10"
                          onClick={() =>
                            updateQuantity(line.productId, line.quantity - 1)
                          }
                          aria-label="Diminuir quantidade"
                        >
                          −
                        </button>
                        <input
                          id={`qty-${line.productId}`}
                          type="number"
                          min={1}
                          max={99}
                          value={line.quantity}
                          onChange={(e) => {
                            const n = parseInt(e.target.value, 10);
                            if (Number.isNaN(n)) return;
                            updateQuantity(line.productId, Math.min(99, Math.max(1, n)));
                          }}
                          className="w-12 border-0 bg-transparent text-center text-sm text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          className="px-3 py-1 text-lg leading-none text-white hover:bg-white/10"
                          onClick={() =>
                            updateQuantity(line.productId, line.quantity + 1)
                          }
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(line.productId)}
                        className="text-xs text-red-400/90 underline-offset-2 hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          {error && (
            <p className="mb-3 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="mb-4 flex items-center justify-between text-white">
            <span className="text-white/70">Subtotal</span>
            <span className="text-xl font-semibold">{formatBRL(subtotalCents)}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearCart}
              disabled={lines.length === 0}
              className="rounded-full border border-white/20 px-4 py-3 text-sm text-white/80 hover:bg-white/10 disabled:opacity-40"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={checkout}
              disabled={lines.length === 0 || loading}
              className="min-w-0 flex-1 rounded-full bg-sky-500 py-3 text-sm font-semibold text-[#060b14] hover:bg-sky-400 disabled:opacity-50"
            >
              {loading ? "Redirecionando…" : "Enviar pedido pelo WhatsApp"}
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-white/40">
            Enviaremos seu pedido direto para o WhatsApp. Configure WHATSAPP_NUMBER em .env
          </p>
        </div>
      </aside>
    </>
  );
}
