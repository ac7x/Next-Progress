'use client';

import { WarehouseInstance } from '@/modules/c-stock/domain';
import { useState } from 'react';
import { useWarehouseItems } from '../hooks/useWarehouseItems';
import { WarehouseItemForm } from './warehouse.item.form';
import { WarehouseItemList } from './warehouse.item.list';

interface WarehouseItemsModalProps {
  warehouseInstance: WarehouseInstance;
  onCloseAction: () => void;
}

export function WarehouseItemsModal({ warehouseInstance, onCloseAction }: WarehouseItemsModalProps) {
  const { data: items = [], isLoading, error } = useWarehouseItems(warehouseInstance.id);
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  const handleItemAdded = () => {
    setActiveTab('list');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">{warehouseInstance.name} - 倉庫物品</h2>
          <button
            onClick={onCloseAction}
            className="text-gray-500 hover:text-gray-700"
            aria-label="關閉"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`py-4 px-6 ${activeTab === 'list' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('list')}
          >
            物品列表
          </button>
          <button
            className={`py-4 px-6 ${activeTab === 'add' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('add')}
          >
            添加物品
          </button>
        </div>

        <div className="p-6 flex-grow overflow-auto">
          {activeTab === 'list' ? (
            <>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-gray-500">載入物品中...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 text-red-700 rounded">
                  {error.message}
                </div>
              ) : (
                <WarehouseItemList items={items} />
              )}
            </>
          ) : (
            <WarehouseItemForm
              warehouseId={warehouseInstance.id}
              onSuccess={handleItemAdded}
            />
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onCloseAction}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
