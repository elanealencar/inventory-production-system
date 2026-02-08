import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';

export const productsRouter = Router();
const controller = new ProductsController();

productsRouter.get('/', (req, res) => controller.list(req, res));
productsRouter.get('/:id', (req, res) => controller.getById(req, res));
productsRouter.post('/', (req, res) => controller.create(req, res));
productsRouter.put('/:id', (req, res) => controller.update(req, res));
productsRouter.delete('/:id', (req, res) => controller.delete(req, res));
