import { Request, Response } from 'express';
import { SuggestionService } from '../services/suggestion.service';

const service = new SuggestionService();

export class SuggestionController {
  async get(_req: Request, res: Response) {
    const result = await service.calculate();
    return res.json(result);
  }
}
