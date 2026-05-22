import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const whatsappNumber = process.env.WHATSAPP_NUMBER;

type CheckoutBody = {
  items?: Array<{
    productId: string;
    name: string;
    model: string;
    priceCents: number;
    quantity: number;
  }>;
};

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export async function POST(req: Request) {
  if (!whatsappNumber) {
    return NextResponse.json(
      { error: "WHATSAPP_NUMBER não configurado no servidor." },
      { status: 500 },
    );
  }

  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const rawItems = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
  }

  const merged = new Map<string, { qty: number }>();

  for (const item of rawItems) {
    const id = typeof item.productId === "string" ? item.productId : "";
    const qty =
      typeof item.quantity === "number"
        ? Math.min(99, Math.max(1, Math.floor(item.quantity)))
        : 1;
    if (!id) continue;
    const prev = merged.get(id)?.qty ?? 0;
    merged.set(id, { qty: Math.min(99, prev + qty) });
  }

  const lineItems: Array<{
    name: string;
    description: string;
    priceCents: number;
    quantity: number;
  }> = [];

  for (const [productId, { qty }] of merged) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json(
        { error: `Produto não encontrado: ${productId}` },
        { status: 400 },
      );
    }

    lineItems.push({
      name: product.name,
      description: product.model,
      priceCents: product.priceCents,
      quantity: qty,
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json({ error: "Nenhuma linha válida." }, { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  const orderLines = lineItems.map((item, index) => {
    const total = formatBRL(item.priceCents * item.quantity);
    return `${index + 1}. ${item.quantity}x ${item.name} (${item.description}) — ${total}`;
  });
  const subtotal = formatBRL(
    lineItems.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),
  );

  const message = [
    "Olá, gostaria de fazer um pedido:",
    "",
    ...orderLines,
    "",
    `Subtotal: ${subtotal}`,
    "",
    `Site: ${base}`,
    "",
    "Por favor, confirme disponibilidade e forma de pagamento.",
  ].join("\n");

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    message,
  )}`;

  return NextResponse.json({ url: whatsappUrl });
}
