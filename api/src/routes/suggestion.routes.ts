import { Router } from 'express';
import { SuggestionController } from '../controllers/suggestion.controller';

export const suggestionRouter = Router();
const controller = new SuggestionController();

suggestionRouter.get('/', (req, res) => controller.get(req, res));
