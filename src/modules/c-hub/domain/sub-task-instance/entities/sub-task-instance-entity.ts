import { SubTaskInstanceCompletionRate } from '../value-objects/sub-task-instance-completion-rate.vo';
import { SubTaskInstanceDescription } from '../value-objects/sub-task-instance-description.vo';
import { SubTaskInstanceEquipmentCount } from '../value-objects/sub-task-instance-equipment-count.vo';
import { SubTaskInstanceName } from '../value-objects/sub-task-instance-name.vo';
import { SubTaskInstancePriority } from '../value-objects/sub-task-instance-priority.vo';
import { SubTaskInstanceStatus, SubTaskInstanceStatusType } from '../value-objects/sub-task-instance-status.vo';

/**
 * 子任務實體定義
 */
export interface SubTaskInstance {
  id: string;
  name: string;
  description: string | null;
  plannedStart: Date | null;
  plannedEnd: Date | null;
  equipmentCount: number | null;
  actualEquipmentCount: number | null;
  startDate: Date | null;
  endDate: Date | null;
  priority: number;
  status: SubTaskInstanceStatusType;
  completionRate: number;
  taskId: string;
  parentTaskId: string | null;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * 創建子任務的輸入數據
 */
export interface CreateSubTaskInstanceProps {
  name: string;
  description?: string | null;
  plannedStart?: Date | null;
  plannedEnd?: Date | null;
  equipmentCount?: number | null;
  actualEquipmentCount?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  priority?: number;
  status?: SubTaskInstanceStatusType;
  completionRate?: number;
  taskId: string;
  parentTaskId?: string | null;
}

/**
 * 更新子任務的輸入數據
 */
export type UpdateSubTaskInstanceProps = Partial<CreateSubTaskInstanceProps>;

/**
 * 豐富的領域模型 - 使用值物件
 */
export interface RichSubTaskInstance {
  id: string;
  name: SubTaskInstanceName;
  description: SubTaskInstanceDescription;
  plannedStart: Date | null;
  plannedEnd: Date | null;
  equipmentCount: SubTaskInstanceEquipmentCount;
  actualEquipmentCount: number | null;
  startDate: Date | null;
  endDate: Date | null;
  priority: SubTaskInstancePriority;
  status: SubTaskInstanceStatus;
  completionRate: SubTaskInstanceCompletionRate;
  taskId: string;
  parentTaskId: string | null;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * 子任務工廠 - 負責建立與驗證子任務實體
 */
export class SubTaskInstanceFactory {
  /**
   * 從基本資料創建子任務
   * @param props 子任務屬性
   */
  static create(props: CreateSubTaskInstanceProps): Partial<RichSubTaskInstance> {
    return {
      name: new SubTaskInstanceName(props.name),
      description: new SubTaskInstanceDescription(props.description ?? null),
      plannedStart: props.plannedStart || null,
      plannedEnd: props.plannedEnd || null,
      equipmentCount: new SubTaskInstanceEquipmentCount(props.equipmentCount ?? null),
      actualEquipmentCount: props.actualEquipmentCount ?? 0,
      startDate: props.startDate || null,
      endDate: props.endDate || null,
      priority: new SubTaskInstancePriority(props.priority ?? 0),
      status: new SubTaskInstanceStatus(props.status || 'TODO'),
      completionRate: new SubTaskInstanceCompletionRate(props.completionRate ?? 0),
      taskId: props.taskId,
      parentTaskId: props.parentTaskId || null
    };
  }

  /**
   * 將資料庫實體轉換為豐富領域實體
   * @param entity 基本實體
   */
  static toRichModel(entity: SubTaskInstance): RichSubTaskInstance {
    return {
      id: entity.id,
      name: new SubTaskInstanceName(entity.name),
      description: new SubTaskInstanceDescription(entity.description),
      plannedStart: entity.plannedStart,
      plannedEnd: entity.plannedEnd,
      equipmentCount: new SubTaskInstanceEquipmentCount(entity.equipmentCount),
      actualEquipmentCount: entity.actualEquipmentCount,
      startDate: entity.startDate,
      endDate: entity.endDate,
      priority: new SubTaskInstancePriority(entity.priority),
      status: new SubTaskInstanceStatus(entity.status),
      completionRate: new SubTaskInstanceCompletionRate(entity.completionRate),
      taskId: entity.taskId,
      parentTaskId: entity.parentTaskId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * 將豐富領域實體轉換為基本實體
   * @param richEntity 豐富領域實體
   */
  static toBasicModel(richEntity: RichSubTaskInstance): SubTaskInstance {
    return {
      id: richEntity.id,
      name: richEntity.name.getValue(),
      description: richEntity.description.getValue(),
      plannedStart: richEntity.plannedStart,
      plannedEnd: richEntity.plannedEnd,
      equipmentCount: richEntity.equipmentCount.getValue(),
      actualEquipmentCount: richEntity.actualEquipmentCount,
      startDate: richEntity.startDate,
      endDate: richEntity.endDate,
      priority: richEntity.priority.getValue(),
      status: richEntity.status.getValue() as SubTaskInstanceStatusType,
      completionRate: richEntity.completionRate.getValue(),
      taskId: richEntity.taskId,
      parentTaskId: richEntity.parentTaskId,
      createdAt: richEntity.createdAt,
      updatedAt: richEntity.updatedAt
    };
  }
}

/**
 * 型別守衛 - 確保型別安全
 * @param instance 需要驗證的對象
 */
export function isValidSubTaskInstance(instance: unknown): instance is SubTaskInstance {
  return (
    typeof instance === 'object' &&
    instance !== null &&
    'id' in instance &&
    'name' in instance &&
    'taskId' in instance &&
    'status' in instance &&
    'createdAt' in instance
  );
}
