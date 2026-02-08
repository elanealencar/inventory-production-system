import { prisma } from '../prisma/client';

type SuggestionItem = {
  productId: number;
  productCode: string;
  productName: string;
  unitValue: number;
  suggestedQuantity: number;
  subtotal: number;
};

export class SuggestionService {
  async calculate() {
    // 1) Carrega estoque
    const rawMaterials = await prisma.rawMaterial.findMany({
      select: { id: true, stockQuantity: true },
    });

    const stock = new Map<number, number>();
    for (const rm of rawMaterials) {
      stock.set(rm.id, rm.stockQuantity);
    }

    // 2) Carrega produtos com BOM
    const products = await prisma.product.findMany({
      include: {
        billOfMaterials: true,
      },
      orderBy: {
        value: 'desc',
      },
    });

    const items: SuggestionItem[] = [];
    let totalValue = 0;

    for (const product of products) {
      const bom = product.billOfMaterials;

      // ignora produto sem BOM
      if (!bom || bom.length === 0) continue;

      // calcula o máximo que dá pra produzir com o estoque atual
      let maxProducible = Infinity;

      for (const bomItem of bom) {
        const available = stock.get(bomItem.rawMaterialId) ?? 0;
        const required = bomItem.requiredQuantity;

        if (required <= 0) {
          maxProducible = 0;
          break;
        }

        const possible = Math.floor(available / required);
        if (possible < maxProducible) maxProducible = possible;
      }

      if (!Number.isFinite(maxProducible) || maxProducible <= 0) continue;

      // 3) "produz": abate estoque
      for (const bomItem of bom) {
        const available = stock.get(bomItem.rawMaterialId) ?? 0;
        const newStock = available - bomItem.requiredQuantity * maxProducible;
        stock.set(bomItem.rawMaterialId, newStock);
      }

      // 4) soma total
      const unitValue = Number(product.value); // Decimal -> number
      const subtotal = unitValue * maxProducible;

      items.push({
        productId: product.id,
        productCode: product.code,
        productName: product.name,
        unitValue,
        suggestedQuantity: maxProducible,
        subtotal,
      });

      totalValue += subtotal;
    }

    return {
      items,
      totalValue,
    };
  }
}
