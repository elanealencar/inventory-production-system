import { useEffect, useMemo, useState } from 'react';
import { rawMaterialsApi } from '../api/rawMaterials.api';
import { Modal } from '../components/Modal';
import { Button, Card, Input, Label } from '../components/ui';
import type {
  RawMaterial,
  RawMaterialCreate,
  RawMaterialUpdate,
} from '../types/rawMaterial';

type Mode = 'create' | 'edit' | 'delete';

export function RawMaterialsPage() {
  const [items, setItems] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('create');
  const [selected, setSelected] = useState<RawMaterial | null>(null);

  const [form, setForm] = useState<RawMaterialCreate>({
    code: '',
    name: '',
    stockQuantity: 0,
  });

  const modalTitle = useMemo(() => {
    if (mode === 'create') return 'Create raw material';
    if (mode === 'edit') return 'Edit raw material';
    return 'Delete raw material';
  }, [mode]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await rawMaterialsApi.list();
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load raw materials');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function closeModal() {
    setOpen(false);
    setSelected(null);
    setMode('create');
    setForm({ code: '', name: '', stockQuantity: 0 });
  }

  function openCreate() {
    setMode('create');
    setSelected(null);
    setForm({ code: '', name: '', stockQuantity: 0 });
    setOpen(true);
  }

  function openEdit(rm: RawMaterial) {
    setMode('edit');
    setSelected(rm);
    setForm({
      code: rm.code,
      name: rm.name,
      stockQuantity: rm.stockQuantity,
    });
    setOpen(true);
  }

  function openDelete(rm: RawMaterial) {
    setMode('delete');
    setSelected(rm);
    setOpen(true);
  }

  async function onSubmit() {
    setError('');
    try {
      if (mode === 'create') {
        await rawMaterialsApi.create(form);
      } else if (mode === 'edit' && selected) {
        const payload: RawMaterialUpdate = {
          code: form.code,
          name: form.name,
          stockQuantity: form.stockQuantity,
        };
        await rawMaterialsApi.update(selected.id, payload);
      }
      closeModal();
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Request failed');
    }
  }

  async function onConfirmDelete() {
    if (!selected) return;
    setError('');
    try {
      await rawMaterialsApi.remove(selected.id);
      closeModal();
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Delete failed');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Raw Materials</h2>
          <p className="text-sm text-gray-600">
            Create, edit and delete raw materials stock.
          </p>
        </div>

        <Button onClick={openCreate}>New raw material</Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        {loading ? (
          <p className="text-sm text-gray-600">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-600">No raw materials found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr className="border-b">
                  <th className="py-3 pr-4">Code</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Stock</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((rm) => (
                  <tr key={rm.id} className="border-b last:border-b-0">
                    <td className="py-3 pr-4 font-medium">{rm.code}</td>
                    <td className="py-3 pr-4">{rm.name}</td>
                    <td className="py-3 pr-4">{rm.stockQuantity}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => openEdit(rm)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => openDelete(rm)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} title={modalTitle} onClose={closeModal}>
        {mode === 'delete' ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{selected?.name}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={onConfirmDelete}>
                Confirm delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))}
                placeholder="RM001"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                placeholder="Raw material name"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="stockQuantity">Stock quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                step="1"
                value={String(form.stockQuantity)}
                onChange={(e) =>
                  setForm((s) => ({ ...s, stockQuantity: Number(e.target.value) }))
                }
                placeholder="0"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={onSubmit}>{mode === 'create' ? 'Create' : 'Save'}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
