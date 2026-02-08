export type RawMaterial = {
  id: number;
  code: string;
  name: string;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
};

export type RawMaterialCreate = {
  code: string;
  name: string;
  stockQuantity: number;
};

export type RawMaterialUpdate = Partial<RawMaterialCreate>;
