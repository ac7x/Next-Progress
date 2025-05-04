'use client';

import { WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { useState } from 'react';
import { useDeleteWarehouseInstance } from '../hooks/useWarehouseMutations';
import { WarehouseItemsModal } from './warehouse-items-modal';

interface WarehouseInstanceListProps {
  warehouseInstances: WarehouseInstance[];
  onDelete?: () => void;
}

export function WarehouseInstanceList({ warehouseInstances, onDelete }: WarehouseInstanceListProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedWarehouseInstance, setSelectedWarehouseInstance] = useState<WarehouseInstance | null>(null);
  const { mutateAsync: deleteMutate, isPending: deleting } = useDeleteWarehouseInstance();

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

  if (warehouseInstances.length === 0) {
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
        {warehouseInstances.map((warehouseInstance) => (
          <div key={warehouseInstance.id} className="border rounded-lg p-4">
            <h3 className="text-lg font-medium">{warehouseInstance.name}</h3>

            {warehouseInstance.description && (
              <p className="text-gray-600 mt-1">{warehouseInstance.description}</p>
            )}

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setSelectedWarehouseInstance(warehouseInstance)}
                className="text-blue-600 hover:text-blue-800"
              >
                查看物品
              </button>

              <button
                onClick={() => handleDelete(warehouseInstance.id)}
                disabled={deleting}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {deleting ? '刪除中...' : '刪除'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedWarehouseInstance && (
        <WarehouseItemsModal
          warehouse={selectedWarehouseInstance}
          onCloseAction={() => setSelectedWarehouseInstance(null)}
        />
      )}
    </div>
  );
}
