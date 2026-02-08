import type { RawMaterial } from './rawMaterial';

export type BomItem = {
  id: number;
  productId: number;
  rawMaterialId: number;
  requiredQuantity: number;
  rawMaterial: RawMaterial;
};

export type BomCreate = {
  rawMaterialId: number;
  requiredQuantity: number;
};

export type BomUpdate = {
  requiredQuantity: number;
};
