import Link from "next/link";
import { ClearCartOnSuccess } from "@/components/ClearCartOnSuccess";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const p = await searchParams;
  const sid = p.session_id;

  return (
    <>
      <ClearCartOnSuccess />
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="mb-2 text-sky-400">Pedido</p>
        <h1
          style={{ fontFamily: "var(--font-display), system-ui" }}
          className="text-4xl uppercase text-white"
        >
          Tudo certo
        </h1>
        <p className="mt-4 text-white/70">
          Obrigado pelo pedido. Em breve entraremos em contato pelo WhatsApp.
        </p>
        {sid && (
          <p className="mt-6 break-all text-xs text-white/40">Ref: {sid}</p>
        )}
        <Link
          href="/"
          className="mt-10 inline-block rounded-full bg-sky-500 px-8 py-3 font-semibold text-[#060b14] hover:bg-sky-400"
        >
          Voltar à loja
        </Link>
      </div>
    </>
  );
}
