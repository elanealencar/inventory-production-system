import { useEffect, useMemo, useState } from 'react';
import { bomApi } from '../api/bom.api';
import { rawMaterialsApi } from '../api/rawMaterials.api';
import type { BomItem } from '../types/bom';
import type { RawMaterial } from '../types/rawMaterial';
import { Button, Input, Label } from './ui';

type Props = {
  productId: number;
};

export function BomEditor({ productId }: Props) {
  const [items, setItems] = useState<BomItem[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [rawMaterialId, setRawMaterialId] = useState<number>(0);
  const [requiredQuantity, setRequiredQuantity] = useState<number>(1);

  const availableOptions = useMemo(() => {
    const linkedIds = new Set(items.map((i) => i.rawMaterialId));
    return rawMaterials.filter((rm) => !linkedIds.has(rm.id));
  }, [items, rawMaterials]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [bom, rms] = await Promise.all([
        bomApi.list(productId),
        rawMaterialsApi.list(),
      ]);
      setItems(bom);
      setRawMaterials(rms);

      // set default selection
      const first = rms.find((rm) => !bom.some((b) => b.rawMaterialId === rm.id));
      setRawMaterialId(first?.id ?? 0);
      setRequiredQuantity(1);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load BOM');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function addItem() {
    if (!rawMaterialId) {
      setError('Select a raw material');
      return;
    }
    if (!requiredQuantity || requiredQuantity <= 0) {
      setError('Required quantity must be greater than 0');
      return;
    }

    setError('');
    try {
      await bomApi.create(productId, { rawMaterialId, requiredQuantity });
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to add BOM item');
    }
  }

  async function removeItem(bomId: number) {
    setError('');
    try {
      await bomApi.remove(productId, bomId);
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to remove BOM item');
    }
  }

  async function updateQuantity(bomId: number, newQty: number) {
    if (!newQty || newQty <= 0) return;
    setError('');
    try {
      await bomApi.update(productId, bomId, { requiredQuantity: newQty });
      setItems((prev) =>
        prev.map((it) => (it.id === bomId ? { ...it, requiredQuantity: newQty } : it)),
      );
    } catch (e: any) {
      setError(e?.message ?? 'Failed to update quantity');
    }
  }

  if (loading) return <p className="text-sm text-gray-600">Loading bill of materials...</p>;

  return (
    <div className="space-y-3 rounded-2xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Bill of materials</h3>
          <p className="text-xs text-gray-600">
            Link raw materials and define required quantity per product unit.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1 md:col-span-2">
          <Label>Raw material</Label>
          <select
            className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
            value={rawMaterialId}
            onChange={(e) => setRawMaterialId(Number(e.target.value))}
          >
            <option value={0}>Select...</option>
            {availableOptions.map((rm) => (
              <option key={rm.id} value={rm.id}>
                {rm.code} — {rm.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label>Required qty</Label>
          <Input
            type="number"
            step="1"
            value={String(requiredQuantity)}
            onChange={(e) => setRequiredQuantity(Number(e.target.value))}
          />
        </div>

        <div className="md:col-span-3 flex justify-end">
          <Button variant="ghost" onClick={addItem} disabled={availableOptions.length === 0}>
            Add item
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {items.length === 0 ? (
          <p className="text-sm text-gray-600">No raw materials linked yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-gray-500">
              <tr className="border-b">
                <th className="py-2 pr-3">Raw material</th>
                <th className="py-2 pr-3">Required qty</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b last:border-b-0">
                  <td className="py-2 pr-3">
                    <div className="font-medium">
                      {it.rawMaterial.code} — {it.rawMaterial.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      Stock: {it.rawMaterial.stockQuantity}
                    </div>
                  </td>

                  <td className="py-2 pr-3">
                    <Input
                      type="number"
                      step="1"
                      defaultValue={it.requiredQuantity}
                      onBlur={(e) => updateQuantity(it.id, Number(e.target.value))}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      per 1 unit of product
                    </p>
                  </td>

                  <td className="py-2 text-right">
                    <Button variant="danger" onClick={() => removeItem(it.id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
