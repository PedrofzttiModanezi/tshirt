import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import type { ProductDTO } from "@/types/product";

export const revalidate = 60;

export default async function Home() {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const products: ProductDTO[] = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    model: p.model,
    description: p.description,
    priceCents: p.priceCents,
    imageUrl: p.imageUrl,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <section className="mb-14 text-center sm:mb-16">
        <p className="mb-2 text-xs uppercase tracking-[0.35em] text-sky-400/90">
          novo drop
        </p>
        <h1
          style={{ fontFamily: "var(--font-display), system-ui" }}
          className="text-4xl uppercase tracking-wide text-white sm:text-5xl md:text-6xl"
        >
          Camisetas street
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/65">
          Visual informal, cores escuras e azul marinho. Três peças por linha no
          desktop — no celular o grid adapta automático.
        </p>
      </section>

      {products.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-[#0f172a] p-8 text-center text-white/60">
          Nenhum produto cadastrado. Rode{" "}
          <code className="rounded bg-black/40 px-2 py-0.5 text-sky-300">
            npm run db:push
          </code>{" "}
          e{" "}
          <code className="rounded bg-black/40 px-2 py-0.5 text-sky-300">
            npm run db:seed
          </code>
          .
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {products.map((product) => (
            <li key={product.id} className="min-h-0">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
