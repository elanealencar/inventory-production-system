import { prisma } from '../prisma/client';

export class RawMaterialsService {
  async list() {
    return prisma.rawMaterial.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getById(id: number) {
    return prisma.rawMaterial.findUnique({ where: { id } });
  }

  async create(data: { code: string; name: string; stockQuantity: number }) {
    return prisma.rawMaterial.create({ data });
  }

  async update(
    id: number,
    data: { code?: string; name?: string; stockQuantity?: number },
  ) {
    return prisma.rawMaterial.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.rawMaterial.delete({ where: { id } });
  }
}
