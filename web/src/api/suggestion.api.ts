import { apiFetch } from './http';
import type { SuggestionResponse } from '../types/suggestion';

export const suggestionApi = {
  get: () => apiFetch<SuggestionResponse>('/production-suggestion'),
};
