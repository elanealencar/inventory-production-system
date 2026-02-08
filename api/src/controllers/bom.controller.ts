import { Request, Response } from 'express';
import { ZodError } from 'zod';

import { BomService } from '../services/bom.service';
import { createBomItemSchema, updateBomItemSchema } from '../validations/bom.validation';

const service = new BomService();

function parseId(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== 'string') throw new Error('Invalid id');

  const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid id');
    return id;
}

export class BomController {
  async list(req: Request, res: Response) {
    try {
      const productId = parseId(req.params.productId);
      const items = await service.listByProduct(productId);
      return res.json(items);
    } catch {
      return res.status(400).json({ message: 'Invalid productId' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const productId = parseId(req.params.productId);
      const payload = createBomItemSchema.parse(req.body);

      const created = await service.addItem(productId, payload);
      return res.status(201).json(created);
    } catch (err: any) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', issues: err.issues });
      }
      const status = err?.status ?? 400;
      // Unique constraint (productId + rawMaterialId)
      const msg =
        err?.code === 'P2002' ? 'This raw material is already linked to the product' : err?.message;
      return res.status(status).json({ message: msg ?? 'Could not create BOM item' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const productId = parseId(req.params.productId);
      const bomId = parseId(req.params.bomId);

      const payload = updateBomItemSchema.parse(req.body);

      const updated = await service.updateItem(productId, bomId, payload.requiredQuantity);
      return res.json(updated);
    } catch (err: any) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', issues: err.issues });
      }
      const status = err?.status ?? 400;
      return res.status(status).json({ message: err?.message ?? 'Could not update BOM item' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const productId = parseId(req.params.productId);
      const bomId = parseId(req.params.bomId);

      await service.deleteItem(productId, bomId);
      return res.status(204).send();
    } catch (err: any) {
      const status = err?.status ?? 400;
      return res.status(status).json({ message: err?.message ?? 'Could not delete BOM item' });
    }
  }
}
