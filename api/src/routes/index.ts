import { Router } from 'express';
import { productsRouter } from './products.routes';
import { rawMaterialsRouter } from './rawMaterials.routes';
import { suggestionRouter } from './suggestion.routes';
import { testRouter } from './test.routes';

export const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Inventory API running' });
});

router.use('/products', productsRouter);
router.use('/raw-materials', rawMaterialsRouter);
router.use('/production-suggestion', suggestionRouter);

if (process.env.NODE_ENV !== 'production') {
  router.use('/test', testRouter);
}