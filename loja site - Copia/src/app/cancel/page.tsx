import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="mb-2 text-amber-400/90">Checkout</p>
      <h1
        style={{ fontFamily: "var(--font-display), system-ui" }}
        className="text-4xl uppercase text-white"
      >
        Cancelado
      </h1>
      <p className="mt-4 text-white/70">
        Nenhuma cobrança foi feita. Seu carrinho continua igual — pode finalizar
        quando quiser.
      </p>
      <Link
        href="/"
        className="mt-10 inline-block rounded-full border border-white/25 px-8 py-3 font-semibold text-white hover:bg-white/10"
      >
        Voltar à loja
      </Link>
    </div>
  );
}
