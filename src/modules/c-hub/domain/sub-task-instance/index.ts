/**
 * 子任務實體領域模型導出
 * 提供統一的導入點，方便其他模組使用子任務實體領域概念
 */

// 實體與工廠導出
export * from './entities/sub-task-instance-entity';
export * from './entities/sub-task-instance-events';
export * from './entities/sub-task-instance-priority.vo';
export * from './entities/sub-task-instance-status.vo';

// 值物件導出
export * from './value-objects/sub-task-instance-completion-rate.vo';
export * from './value-objects/sub-task-instance-description.vo';
export * from './value-objects/sub-task-instance-equipment-count.vo';
export * from './value-objects/sub-task-instance-name.vo';

// 明確重新匯出型別，避免型別查找失敗
export type { SubTaskInstanceStatusType } from './value-objects/sub-task-instance-status.vo';

// 領域事件導出

// 存儲庫接口導出
export * from './repositories/sub-task-instance-repository-interface';

// 領域服務導出
export * from './services/sub-task-instance-service';

