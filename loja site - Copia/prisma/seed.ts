import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  const products = [
    {
      slug: "oversized-tag-preto",
      name: "TAG OVERSIZED",
      model: "Oversized · algodão 240g",
      description:
        "Corte largo, gola canelada grossa e silk fosco. Ideal pra sobreposição com jaqueta.",
      priceCents: 12990,
      imageUrl:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    },
    {
      slug: "street-skate-marinho",
      name: "SKATE DROP",
      model: "Regular fit · malha penteado",
      description:
        "Estampa frontal minimalista, vibe skatepark. Tecido respirável pra dia inteiro na rua.",
      priceCents: 9990,
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    },
    {
      slug: "grafite-neon",
      name: "NEON GRAFFITI",
      model: "Box fit · costura reforçada",
      description:
        "Detalhes em azul claro + base escura. Combina com cargo e tênis chunky.",
      priceCents: 11990,
      imageUrl:
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    },
    {
      slug: "drop-midnight",
      name: "MIDNIGHT LOGO",
      model: "Oversized · preto profundo",
      description:
        "Logo pequeno no peito, estética clean. Azul marinho quase preto sob luz fraca.",
      priceCents: 10990,
      imageUrl:
        "https://images.unsplash.com/photo-1583743814966-893619137dac?w=600&q=80",
    },
    {
      slug: "urban-layer-branco",
      name: "URBAN LAYER",
      model: "Cropped / regular · off-white",
      description:
        "Base clara pra contrastar com calça escura. Estampa nas costas inspirada em pixo.",
      priceCents: 10490,
      imageUrl:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    },
    {
      slug: "wave-azul-claro",
      name: "WAVE TIE-DYE",
      model: "Unissex · lavagem especial",
      description:
        "Degradê azul claro + marinho. Cada peça varia levemente — autenticidade street.",
      priceCents: 13990,
      imageUrl:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log(`Seed: ${products.length} produtos criados.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
