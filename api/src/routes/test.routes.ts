import { Router } from 'express';
import { prisma } from '../prisma/client';

export const testRouter = Router();

testRouter.post('/reset', async (_req, res) => {
  await prisma.billOfMaterials.deleteMany();
  await prisma.product.deleteMany();
  await prisma.rawMaterial.deleteMany();

  const rm1 = await prisma.rawMaterial.create({
    data: { code: 'RM001', name: 'Glycerin', stockQuantity: 200 },
  });
  const rm2 = await prisma.rawMaterial.create({
    data: { code: 'RM002', name: 'Fragrance', stockQuantity: 6 },
  });

  const p2 = await prisma.product.create({
    data: { code: 'P002', name: 'High Value Product', value: 100 },
  });

  await prisma.billOfMaterials.createMany({
    data: [
      { productId: p2.id, rawMaterialId: rm1.id, requiredQuantity: 2 },
      { productId: p2.id, rawMaterialId: rm2.id, requiredQuantity: 1 },
    ],
  });

  return res.json({ ok: true });
});
