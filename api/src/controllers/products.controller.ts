import { Request, Response } from 'express';
import { ZodError } from 'zod';

import { ProductsService } from '../services/products.service';
import { createProductSchema, updateProductSchema } from '../validations/products.validation';

const service = new ProductsService();

function parseId(req: Request) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) throw new Error('Invalid id');
  return id;
}

export class ProductsController {
  async list(_req: Request, res: Response) {
    const products = await service.list();
    return res.json(products);
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req);
      const product = await service.getById(id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    } catch {
      return res.status(400).json({ message: 'Invalid id' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const payload = createProductSchema.parse(req.body);
      const created = await service.create(payload);
      return res.status(201).json(created);
    } catch (err: any) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', issues: err.issues });
      }

      if (err?.code === 'P2002') {
        return res.status(409).json({ message: 'Product code already exists' });
      }

      console.error(err);
      return res.status(500).json({ message: 'Could not create product' });
    }

  }

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req);
      const payload = updateProductSchema.parse(req.body);

      const updated = await service.update(id, payload);
      return res.json(updated);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', issues: err.issues });
      }
      return res.status(400).json({ message: 'Could not update product' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req);
      await service.delete(id);
      return res.status(204).send();
    } catch {
      return res.status(400).json({ message: 'Could not delete product' });
    }
  }
}
