import { Router } from 'express';
import { BomController } from '../controllers/bom.controller';

export const bomRouter = Router({ mergeParams: true });
const controller = new BomController();

bomRouter.get('/', (req, res) => controller.list(req, res));
bomRouter.post('/', (req, res) => controller.create(req, res));
bomRouter.put('/:bomId', (req, res) => controller.update(req, res));
bomRouter.delete('/:bomId', (req, res) => controller.delete(req, res));
