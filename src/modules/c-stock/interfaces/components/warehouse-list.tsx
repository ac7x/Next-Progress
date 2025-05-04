'use client';

import { Warehouse } from '@/modules/c-stock/domain/warehouse-entity';
import { useState } from 'react';
import { useDeleteWarehouse } from '../hooks/useWarehouseMutations';
import { WarehouseItemsModal } from './warehouse-items-modal';

interface WarehouseListProps {
  warehouses: Warehouse[];
  onDelete?: () => void;
}

export function WarehouseList({ warehouses, onDelete }: WarehouseListProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const { mutateAsync: deleteMutate, isPending: deleting } = useDeleteWarehouse();

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此倉庫嗎？這將同時刪除所有倉庫內的物品。')) return;
    setError(null);
    try {
      await deleteMutate(id);
      onDelete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除倉庫失敗');
    }
  };

  if (warehouses.length === 0) {
    return <p className="text-gray-500">目前沒有倉庫，請建立一個新倉庫。</p>;
  }

  return (
    <div className="mb-12">
      {error && (
        <div className="mb-4 p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => (
          <div key={warehouse.id} className="border rounded-lg p-4">
            <h3 className="text-lg font-medium">{warehouse.name}</h3>

            {warehouse.description && (
              <p className="text-gray-600 mt-1">{warehouse.description}</p>
            )}

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setSelectedWarehouse(warehouse)}
                className="text-blue-600 hover:text-blue-800"
              >
                查看物品
              </button>

              <button
                onClick={() => handleDelete(warehouse.id)}
                disabled={deleting}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {deleting ? '刪除中...' : '刪除'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedWarehouse && (
        <WarehouseItemsModal
          warehouse={selectedWarehouse}
          onCloseAction={() => setSelectedWarehouse(null)}
        />
      )}
    </div>
  );
}
