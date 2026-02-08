import { apiFetch } from './http';
import type { BomCreate, BomItem, BomUpdate } from '../types/bom';

export const bomApi = {
  list: (productId: number) =>
    apiFetch<BomItem[]>(`/products/${productId}/bom`),

  create: (productId: number, data: BomCreate) =>
    apiFetch<BomItem>(`/products/${productId}/bom`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (productId: number, bomId: number, data: BomUpdate) =>
    apiFetch<BomItem>(`/products/${productId}/bom/${bomId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (productId: number, bomId: number) =>
    apiFetch<void>(`/products/${productId}/bom/${bomId}`, {
      method: 'DELETE',
    }),
};
