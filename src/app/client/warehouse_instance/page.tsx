// src/app/client/warehouse_instance/page.tsx

import { initializeStockModule } from '@/modules/c-stock/module';
import CStockWarehouseInstancePage from '@/modules/c-stock/interfaces/pages/warehouse.page';

// 初始化倉庫模組
initializeStockModule();

export default function WarehouseInstancePage() {
  return <CStockWarehouseInstancePage />;
}
