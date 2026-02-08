import { useEffect, useMemo, useState } from 'react';
import { productsApi } from '../api/products.api';
import { Modal } from '../components/Modal';
import { Button, Card, Input, Label } from '../components/ui';
import type { Product, ProductCreate, ProductUpdate } from '../types/product';
import { BomEditor } from '../components/BomEditor';

type Mode = 'create' | 'edit' | 'delete';

export function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('create');
  const [selected, setSelected] = useState<Product | null>(null);

  const [form, setForm] = useState<ProductCreate>({
    code: '',
    name: '',
    value: 0,
  });

  const modalTitle = useMemo(() => {
    if (mode === 'create') return 'Create product';
    if (mode === 'edit') return 'Edit product';
    return 'Delete product';
  }, [mode]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await productsApi.list();
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load products');
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
    setForm({ code: '', name: '', value: 0 });
  }

  function openCreate() {
    setMode('create');
    setSelected(null);
    setForm({ code: '', name: '', value: 0 });
    setOpen(true);
  }

  function openEdit(p: Product) {
    setMode('edit');
    setSelected(p);
    setForm({
      code: p.code,
      name: p.name,
      value: Number(p.value),
    });
    setOpen(true);
  }

  function openDelete(p: Product) {
    setMode('delete');
    setSelected(p);
    setOpen(true);
  }

  async function onSubmit() {
    setError('');
    try {
      if (mode === 'create') {
        await productsApi.create(form);
      } else if (mode === 'edit' && selected) {
        const payload: ProductUpdate = {
          code: form.code,
          name: form.name,
          value: form.value,
        };
        await productsApi.update(selected.id, payload);
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
      await productsApi.remove(selected.id);
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
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-sm text-gray-600">Create, edit and delete products.</p>
        </div>

        <Button onClick={openCreate}>New product</Button>
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
          <p className="text-sm text-gray-600">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr className="border-b">
                  <th className="py-3 pr-4">Code</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Value</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b last:border-b-0">
                    <td className="py-3 pr-4 font-medium">{p.code}</td>
                    <td className="py-3 pr-4">{p.name}</td>
                    <td className="py-3 pr-4">R$ {Number(p.value).toFixed(2)}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => openEdit(p)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => openDelete(p)}>
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
        {mode === 'edit' && selected && (
          <BomEditor productId={selected.id} />
        )}
        {mode === 'delete' ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete <span className="font-semibold">{selected?.name}</span>?
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
                placeholder="P001"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                placeholder="Product name"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={String(form.value)}
                onChange={(e) => setForm((s) => ({ ...s, value: Number(e.target.value) }))}
                placeholder="0.00"
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
