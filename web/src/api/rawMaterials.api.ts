import { apiFetch } from './http';
import type { RawMaterial, RawMaterialCreate, RawMaterialUpdate } from '../types/rawMaterial';

export const rawMaterialsApi = {
  list: () => apiFetch<RawMaterial[]>('/raw-materials'),
  create: (data: RawMaterialCreate) =>
    apiFetch<RawMaterial>('/raw-materials', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: RawMaterialUpdate) =>
    apiFetch<RawMaterial>(`/raw-materials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) =>
    apiFetch<void>(`/raw-materials/${id}`, { method: 'DELETE' }),
};
