export type Product = {
  id: number;
  code: string;
  name: string;
  value: string; // vem como string do Prisma (Decimal)
  createdAt: string;
  updatedAt: string;
};

export type ProductCreate = {
  code: string;
  name: string;
  value: number;
};

export type ProductUpdate = Partial<ProductCreate>;
