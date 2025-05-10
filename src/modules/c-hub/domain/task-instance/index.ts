/**
 * 任務實例 (TaskInstance) 領域模型匯出入口點
 * 
 * 這個文件集中匯出所有與 TaskInstance 相關的領域模型元素：
 * - 實體 (Entities)
 * - 值物件 (Value Objects)
 * - 領域服務 (Domain Services)
 * - 儲存庫介面 (Repository Interfaces)
 * - 事件 (Events)
 * - 常數 (Constants)
 * 
 * 其他模塊只需從此入口點導入，降低耦合性。
 */

// 統一匯出實體
export * from './entities';

// 統一匯出值物件
export * from './value-objects';

// 統一匯出儲存庫介面
export * from './repositories';

// 統一匯出領域服務
export * from './services';

// 統一匯出事件
export * from './events';

// 統一匯出常數
export * from './constants';

// 類型別名 - 領域層直接使用的類型定義
export type { CreateTaskInstanceProps, RichTaskInstance, TaskInstance, UpdateTaskInstanceProps } from './entities/task-instance-entity';
export type { TaskInstanceStatusType } from './value-objects/task-instance-status.vo';

