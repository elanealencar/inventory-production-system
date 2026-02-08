import { SuggestionService } from '../src/services/suggestion.service';

// Mock do Prisma client usado em ../src/prisma/client
jest.mock('../src/prisma/client', () => {
  return {
    prisma: {
      rawMaterial: {
        findMany: jest.fn(),
      },
      product: {
        findMany: jest.fn(),
      },
    },
  };
});

import { prisma } from '../src/prisma/client';

describe('SuggestionService', () => {
  it('should prioritize higher value products and calculate totalValue correctly', async () => {
    // Estoque: RM1=200, RM2=6
    (prisma.rawMaterial.findMany as jest.Mock).mockResolvedValue([
      { id: 1, stockQuantity: 200 },
      { id: 10, stockQuantity: 6 },
    ]);

    // Produtos já ordenados por value desc (como no service)
    // P002 value 100 usa RM1(2) + RM2(1) => max = min(200/2=100, 6/1=6) = 6
    // Depois sobra RM2=0, então P001 não produz
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        id: 5,
        code: 'P002',
        name: 'High Value Product',
        value: '100',
        billOfMaterials: [
          { rawMaterialId: 1, requiredQuantity: 2 },
          { rawMaterialId: 10, requiredQuantity: 1 },
        ],
      },
      {
        id: 1,
        code: 'P001',
        name: 'Shampoo',
        value: '25.9',
        billOfMaterials: [
          { rawMaterialId: 1, requiredQuantity: 10 },
          { rawMaterialId: 10, requiredQuantity: 1 },
        ],
      },
    ]);

    const service = new SuggestionService();
    const result = await service.calculate();

    expect(result).toEqual({
      items: [
        {
          productId: 5,
          productCode: 'P002',
          productName: 'High Value Product',
          unitValue: 100,
          suggestedQuantity: 6,
          subtotal: 600,
        },
      ],
      totalValue: 600,
    });
  });

  it('should return empty when no product can be produced', async () => {
    (prisma.rawMaterial.findMany as jest.Mock).mockResolvedValue([
      { id: 1, stockQuantity: 0 },
      { id: 10, stockQuantity: 0 },
    ]);

    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        id: 5,
        code: 'P002',
        name: 'High Value Product',
        value: '100',
        billOfMaterials: [
          { rawMaterialId: 1, requiredQuantity: 2 },
          { rawMaterialId: 10, requiredQuantity: 1 },
        ],
      },
    ]);

    const service = new SuggestionService();
    const result = await service.calculate();

    expect(result.items).toEqual([]);
    expect(result.totalValue).toBe(0);
  });
});
