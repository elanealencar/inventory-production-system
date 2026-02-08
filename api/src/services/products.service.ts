import { prisma } from '../prisma/client';

export class ProductsService {
  async list() {
    return prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getById(id: number) {
    return prisma.product.findUnique({ where: { id } });
  }

  async create(data: { code: string; name: string; value: number }) {
    return prisma.product.create({
      data: {
        code: data.code,
        name: data.name,
        value: data.value, // Prisma Decimal aceita number
      },
    });
  }

  async update(id: number, data: { code?: string; name?: string; value?: number }) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.product.delete({ where: { id } });
  }
}
