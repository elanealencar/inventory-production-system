import { z } from 'zod';

export const createRawMaterialSchema = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(1),
  stockQuantity: z.number().int().min(0),
});

export const updateRawMaterialSchema = z.object({
  code: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  stockQuantity: z.number().int().min(0).optional(),
});
