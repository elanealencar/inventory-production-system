import { z } from 'zod';

export const createBomItemSchema = z.object({
  rawMaterialId: z.number().int().positive(),
  requiredQuantity: z.number().int().positive(),
});

export const updateBomItemSchema = z.object({
  requiredQuantity: z.number().int().positive(),
});
