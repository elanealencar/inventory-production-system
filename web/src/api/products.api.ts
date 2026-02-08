import { apiFetch } from './http';
import type { Product, ProductCreate, ProductUpdate } from '../types/product';

export const productsApi = {
  list: () => apiFetch<Product[]>('/products'),
  create: (data: ProductCreate) =>
    apiFetch<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: ProductUpdate) =>
    apiFetch<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) =>
    apiFetch<void>(`/products/${id}`, { method: 'DELETE' }),
};
