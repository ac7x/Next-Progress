import { 
    TaskInstanceCompletionRate,
    TaskInstanceDescription,
    TaskInstanceEquipmentCount,
    TaskInstanceName,
    TaskInstancePriority,
    TaskInstanceStatus,
    TaskInstanceStatusType
} from '../value-objects';

/**
 * 任務實例基本實體定義
 */
export interface TaskInstance {
    id: string;
    name: string;
    description: string | null;
    plannedStart: Date | null;
    plannedEnd: Date | null;
    equipmentCount: number | null;
    actualEquipmentCount: number | null;
    status: TaskInstanceStatusType;
    priority: number;
    completionRate: number;
    engineeringId: string | null;
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 建立任務實例的輸入資料
 */
export interface CreateTaskInstanceProps {
    name: string;
    description?: string | null;
    plannedStart?: Date | null;
    plannedEnd?: Date | null;
    equipmentCount?: number | null;
    actualEquipmentCount?: number | null;
    status?: TaskInstanceStatusType;
    priority?: number;
    completionRate?: number;
    engineeringId?: string | null;
    projectId?: string;
}

/**
 * 更新任務實例的輸入資料
 */
export type UpdateTaskInstanceProps = Partial<Omit<TaskInstance, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * 豐富的任務實例領域模型 - 使用值物件
 */
export interface RichTaskInstance {
    id: string;
    name: TaskInstanceName;
    description: TaskInstanceDescription;
    plannedStart: Date | null;
    plannedEnd: Date | null;
    equipmentCount: TaskInstanceEquipmentCount;
    actualEquipmentCount: TaskInstanceEquipmentCount;
    status: TaskInstanceStatus;
    priority: TaskInstancePriority;
    completionRate: TaskInstanceCompletionRate;
    engineeringId: string | null;
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 任務實例工廠 - 負責建立與驗證任務實例實體
 */
export class TaskInstanceFactory {
    /**
     * 從基本資料創建任務實例
     * @param props 任務實例屬性
     */
    static create(props: CreateTaskInstanceProps): Partial<RichTaskInstance> {
        return {
            name: new TaskInstanceName(props.name),
            description: new TaskInstanceDescription(props.description ?? null),
            plannedStart: props.plannedStart || null,
            plannedEnd: props.plannedEnd || null,
            equipmentCount: new TaskInstanceEquipmentCount(props.equipmentCount ?? null),
            actualEquipmentCount: new TaskInstanceEquipmentCount(props.actualEquipmentCount ?? null),
            status: new TaskInstanceStatus(props.status || 'TODO'),
            priority: new TaskInstancePriority(props.priority ?? 0),
            completionRate: new TaskInstanceCompletionRate(props.completionRate ?? 0),
            engineeringId: props.engineeringId || null,
            projectId: props.projectId || ''
        };
    }

    /**
     * 將資料庫實體轉換為豐富領域實體
     * @param entity 基本實體
     */
    static toRichModel(entity: TaskInstance): RichTaskInstance {
        return {
            id: entity.id,
            name: new TaskInstanceName(entity.name),
            description: new TaskInstanceDescription(entity.description),
            plannedStart: entity.plannedStart,
            plannedEnd: entity.plannedEnd,
            equipmentCount: new TaskInstanceEquipmentCount(entity.equipmentCount),
            actualEquipmentCount: new TaskInstanceEquipmentCount(entity.actualEquipmentCount),
            status: new TaskInstanceStatus(entity.status),
            priority: new TaskInstancePriority(entity.priority),
            completionRate: new TaskInstanceCompletionRate(entity.completionRate),
            engineeringId: entity.engineeringId,
            projectId: entity.projectId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }

    /**
     * 將豐富領域實體轉換為基本實體
     * @param richEntity 豐富領域實體
     */
    static toBasicModel(richEntity: RichTaskInstance): TaskInstance {
        return {
            id: richEntity.id,
            name: richEntity.name.getValue(),
            description: richEntity.description.getValue(),
            plannedStart: richEntity.plannedStart,
            plannedEnd: richEntity.plannedEnd,
            equipmentCount: richEntity.equipmentCount.getValue(),
            actualEquipmentCount: richEntity.actualEquipmentCount.getValue(),
            status: richEntity.status.getValue(),
            priority: richEntity.priority.getValue(),
            completionRate: richEntity.completionRate.getValue(),
            engineeringId: richEntity.engineeringId,
            projectId: richEntity.projectId,
            createdAt: richEntity.createdAt,
            updatedAt: richEntity.updatedAt
        };
    }
}

/**
 * 型別守衛 - 確保型別安全
 * @param task 需要驗證的對象
 */
export function isValidTaskInstance(task: unknown): task is TaskInstance {
    return (
        typeof task === 'object' &&
        task !== null &&
        'id' in task &&
        'name' in task &&
        'status' in task &&
        'projectId' in task &&
        'createdAt' in task &&
        'updatedAt' in task
    );
}