import { Router } from 'express';
import { RawMaterialsController } from '../controllers/rawMaterials.controller';

export const rawMaterialsRouter = Router();
const controller = new RawMaterialsController();

rawMaterialsRouter.get('/', (req, res) => controller.list(req, res));
rawMaterialsRouter.get('/:id', (req, res) => controller.getById(req, res));
rawMaterialsRouter.post('/', (req, res) => controller.create(req, res));
rawMaterialsRouter.put('/:id', (req, res) => controller.update(req, res));
rawMaterialsRouter.delete('/:id', (req, res) => controller.delete(req, res));
