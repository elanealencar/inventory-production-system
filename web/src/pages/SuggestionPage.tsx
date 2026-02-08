import { useState } from 'react';
import { suggestionApi } from '../api/suggestion.api';
import { Card, Button } from '../components/ui';
import type { SuggestionResponse } from '../types/suggestion';

export function SuggestionPage() {
  const [data, setData] = useState<SuggestionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await suggestionApi.get();
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load suggestion');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Production Suggestion</h2>
          <p className="text-sm text-gray-600">
            Based on current stock and product value priority.
          </p>
        </div>

        <Button onClick={load} disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate suggestion'}
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!data ? (
        <Card>
          <p className="text-sm text-gray-600">
            Click <span className="font-medium">Calculate suggestion</span> to see what can be produced.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              {data.items.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No products can be produced with the current stock.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase text-gray-500">
                      <tr className="border-b">
                        <th className="py-3 pr-4">Product</th>
                        <th className="py-3 pr-4">Unit value</th>
                        <th className="py-3 pr-4">Qty</th>
                        <th className="py-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((it) => (
                        <tr key={it.productId} className="border-b last:border-b-0">
                          <td className="py-3 pr-4">
                            <div className="font-medium">
                              {it.productCode} — {it.productName}
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            R$ {it.unitValue.toFixed(2)}
                          </td>
                          <td className="py-3 pr-4">{it.suggestedQuantity}</td>
                          <td className="py-3 text-right font-medium">
                            R$ {it.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <h3 className="text-sm font-semibold">Total value</h3>
              <p className="mt-2 text-2xl font-semibold">
                R$ {data.totalValue.toFixed(2)}
              </p>
              <p className="mt-2 text-xs text-gray-600">
                Calculated using value priority (highest value first).
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
