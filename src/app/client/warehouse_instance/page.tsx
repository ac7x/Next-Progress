'use client';

import { WarehouseInstanceForm } from '@/modules/c-stock/interfaces/components/warehouse-form';
import { WarehouseInstanceList } from '@/modules/c-stock/interfaces/components/warehouse-list';
import { useWarehouseInstances } from '@/modules/c-stock/interfaces/hooks/useWarehouses';

export default function WarehouseInstancePage() {
  const { data: warehouseInstances = [], isLoading, error } = useWarehouseInstances();

  if (isLoading) return null;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <h1 className="text-3xl font-bold mb-8">倉庫管理</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">建立倉庫</h2>
        <div className="max-w-md">
          <WarehouseInstanceForm />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">倉庫列表</h2>
        <WarehouseInstanceList warehouseInstances={warehouseInstances} />
      </section>
    </div>
  );
}