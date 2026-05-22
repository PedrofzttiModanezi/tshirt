"use client";

import Image from "next/image";
import { useCart } from "@/context/CartProvider";
import type { ProductDTO } from "@/types/product";

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function ProductCard({ product }: { product: ProductDTO }) {
  const { addToCart } = useCart();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#101a2e] to-[#0a0f1a] shadow-lg shadow-black/40 transition hover:border-sky-400/30 hover:shadow-sky-900/20">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0c1424]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl opacity-40">
            👕
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060b14]/90 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h2
            style={{ fontFamily: "var(--font-display), system-ui" }}
            className="text-xl uppercase tracking-wide text-white"
          >
            {product.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-sky-300/90">{product.model}</p>
        </div>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-white/70">
          {product.description}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="text-lg font-semibold text-white">
            {formatBRL(product.priceCents)}
          </span>
          <button
            type="button"
            onClick={() =>
              addToCart({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                model: product.model,
                priceCents: product.priceCents,
                imageUrl: product.imageUrl,
              })
            }
            className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-[#060b14] transition hover:bg-sky-400 active:scale-[0.98]"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </article>
  );
}
