import { Request, Response } from 'express';
import { ZodError } from 'zod';

import { RawMaterialsService } from '../services/rawMaterials.service';
import {
  createRawMaterialSchema,
  updateRawMaterialSchema,
} from '../validations/rawMaterials.validation';

const service = new RawMaterialsService();

function parseId(req: Request) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) throw new Error('Invalid id');
  return id;
}

export class RawMaterialsController {
  async list(_req: Request, res: Response) {
    const items = await service.list();
    return res.json(items);
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req);
      const item = await service.getById(id);
      if (!item) return res.status(404).json({ message: 'Raw material not found' });
      return res.json(item);
    } catch {
      return res.status(400).json({ message: 'Invalid id' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const payload = createRawMaterialSchema.parse(req.body);
      const created = await service.create(payload);
      return res.status(201).json(created);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', issues: err.issues });
      }
      return res.status(400).json({ message: 'Could not create raw material' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req);
      const payload = updateRawMaterialSchema.parse(req.body);
      const updated = await service.update(id, payload);
      return res.json(updated);
      } catch (err: any) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', issues: err.issues });
      }

      if (err?.code === 'P2002') {
        return res.status(409).json({ message: 'Raw material code already exists' });
      }

      console.error(err);
      return res.status(500).json({ message: 'Could not create raw material' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req);
      await service.delete(id);
      return res.status(204).send();
    } catch {
      return res.status(400).json({ message: 'Could not delete raw material' });
    }
  }
}
