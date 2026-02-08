import { prisma } from '../prisma/client';

export class BomService {
  async listByProduct(productId: number) {
    return prisma.billOfMaterials.findMany({
      where: { productId },
      include: {
        rawMaterial: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async addItem(productId: number, data: { rawMaterialId: number; requiredQuantity: number }) {
    // garante que product e raw material existem (boa prática)
    const [product, rawMaterial] = await Promise.all([
      prisma.product.findUnique({ where: { id: productId } }),
      prisma.rawMaterial.findUnique({ where: { id: data.rawMaterialId } }),
    ]);

    if (!product) {
      const err = new Error('Product not found');
      (err as any).status = 404;
      throw err;
    }

    if (!rawMaterial) {
      const err = new Error('Raw material not found');
      (err as any).status = 404;
      throw err;
    }

    return prisma.billOfMaterials.create({
      data: {
        productId,
        rawMaterialId: data.rawMaterialId,
        requiredQuantity: data.requiredQuantity,
      },
      include: { rawMaterial: true, product: true },
    });
  }

  async updateItem(productId: number, bomId: number, requiredQuantity: number) {
    // garante que o item pertence ao produto (evita update errado)
    const item = await prisma.billOfMaterials.findUnique({ where: { id: bomId } });

    if (!item || item.productId !== productId) {
      const err = new Error('BOM item not found for this product');
      (err as any).status = 404;
      throw err;
    }

    return prisma.billOfMaterials.update({
      where: { id: bomId },
      data: { requiredQuantity },
      include: { rawMaterial: true, product: true },
    });
  }

  async deleteItem(productId: number, bomId: number) {
    const item = await prisma.billOfMaterials.findUnique({ where: { id: bomId } });

    if (!item || item.productId !== productId) {
      const err = new Error('BOM item not found for this product');
      (err as any).status = 404;
      throw err;
    }

    await prisma.billOfMaterials.delete({ where: { id: bomId } });
  }
}
