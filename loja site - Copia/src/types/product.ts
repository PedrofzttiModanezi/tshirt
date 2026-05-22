export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  model: string;
  description: string;
  priceCents: number;
  imageUrl: string | null;
};

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  model: string;
  priceCents: number;
  imageUrl: string | null;
  quantity: number;
};
