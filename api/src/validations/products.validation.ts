import { z } from 'zod';

export const createProductSchema = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(1),
  value: z.number().positive(),
});

export const updateProductSchema = z.object({
  code: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  value: z.number().positive().optional(),
});
