/**
 * C-Stock Interface Layer
 * 
 * 用法說明：
 * - 建議於 presentation 層（如 page、component）直接 import 本層 hooks/components
 * - hooks 只負責資料取得/快取/觸發 Server Action，無業務邏輯
 * - 元件僅負責 UI 呈現與互動
 * - 請勿於本層寫入任何業務邏輯，所有業務規則應封裝於 domain/application 層
 */

export * from './hooks/useWarehouseInstances';
export * from './hooks/useWarehouseItemMutations';
export * from './hooks/useWarehouseItems';
export * from './hooks/useWarehouseMutations';

export * from './components/warehouse-form';
export * from './components/warehouse-item-form';
export * from './components/warehouse-item-list';
export * from './components/warehouse-items-modal';
export * from './components/warehouse-list';

export * from './utils/warehouse-display-utils';

// 使用範例：
// import { useWarehouseInstances, WarehouseInstanceList } from '@/modules/c-stock/interfaces';
// const { data } = useWarehouseInstances();
// <WarehouseInstanceList warehouseInstances={data ?? []} />
