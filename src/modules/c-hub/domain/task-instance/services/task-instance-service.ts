import {
    CreateTaskInstanceProps,
    RichTaskInstance,
    TaskInstance,
    TaskInstanceFactory,
    UpdateTaskInstanceProps
} from '../entities';
import {
    TaskInstanceCompletedEvent,
    TaskInstanceCreatedEvent,
    TaskInstanceDeletedEvent,
    TaskInstanceUpdatedEvent
} from '../events';
import { TaskInstanceRepository } from '../repositories';
import { TaskInstanceStatusType } from '../value-objects';

/**
 * 任務實例領域服務
 * 封裝與任務實例相關的核心業務邏輯與行為
 */
export class TaskInstanceService {
    constructor(private readonly taskInstanceRepository: TaskInstanceRepository) { }

    /**
     * 創建新任務實例
     * @param props 任務實例創建屬性
     * @returns 創建的任務實例
     */
    async createTaskInstance(props: CreateTaskInstanceProps): Promise<TaskInstance> {
        // 使用工廠創建豐富領域對象
        const richTaskInstanceProps = TaskInstanceFactory.create(props);

        // 持久化到資料庫
        const createdTaskInstance = await this.taskInstanceRepository.create(props);

        // 發布任務實例創建事件
        new TaskInstanceCreatedEvent(
            createdTaskInstance.id,
            createdTaskInstance.name,
            createdTaskInstance.projectId
        );

        return createdTaskInstance;
    }

    /**
     * 更新任務實例
     * @param id 任務實例 ID
     * @param props 更新屬性
     * @returns 更新後的任務實例
     */
    async updateTaskInstance(id: string, props: UpdateTaskInstanceProps): Promise<TaskInstance> {
        // 確認任務實例存在
        const existingTaskInstance = await this.taskInstanceRepository.findById(id);
        if (!existingTaskInstance) {
            throw new Error(`找不到 ID 為 ${id} 的任務實例`);
        }

        // === 自動推導完成率與狀態 ===
        let updatedProps = { ...props };

        if (
            props.actualEquipmentCount !== undefined ||
            props.equipmentCount !== undefined
        ) {
            const equipmentCount = props.equipmentCount ?? existingTaskInstance.equipmentCount ?? 0;
            const actualEquipmentCount = props.actualEquipmentCount ?? existingTaskInstance.actualEquipmentCount ?? 0;

            let completionRate = equipmentCount > 0
                ? Math.round((actualEquipmentCount / equipmentCount) * 100)
                : 0;

            if (completionRate > 100) completionRate = 100;

            let status: TaskInstanceStatusType = existingTaskInstance.status as TaskInstanceStatusType;
            if (completionRate >= 100) status = 'DONE';
            else if (completionRate > 0) status = 'IN_PROGRESS';
            else status = 'TODO';

            // 只有當計算出的值與現有值不同時才更新
            if (completionRate !== existingTaskInstance.completionRate) {
                updatedProps.completionRate = completionRate;
            }

            if (status !== existingTaskInstance.status) {
                updatedProps.status = status;
            }
        }

        // 更新任務實例
        const updatedTaskInstance = await this.taskInstanceRepository.update(id, updatedProps);

        // 發布任務實例更新事件
        new TaskInstanceUpdatedEvent(updatedTaskInstance.id, updatedTaskInstance.name);

        // 如果任務狀態為已完成或完成率達到100%，發布任務完成事件
        if (updatedTaskInstance.status === 'DONE' || updatedTaskInstance.completionRate === 100) {
            new TaskInstanceCompletedEvent(updatedTaskInstance.id, updatedTaskInstance.projectId);
        }

        return updatedTaskInstance;
    }

    /**
     * 更新任務實例狀態
     * @param id 任務實例 ID
     * @param status 新狀態
     * @returns 更新後的任務實例
     */
    async updateTaskStatus(id: string, status: TaskInstanceStatusType): Promise<TaskInstance> {
        return this.updateTaskInstance(id, { status });
    }

    /**
     * 刪除任務實例
     * @param id 任務實例 ID
     * @returns 是否成功刪除
     */
    async deleteTaskInstance(id: string): Promise<boolean> {
        // 確認任務實例存在
        const existingTaskInstance = await this.taskInstanceRepository.findById(id);
        if (!existingTaskInstance) {
            throw new Error(`找不到 ID 為 ${id} 的任務實例`);
        }

        // 刪除任務實例
        const result = await this.taskInstanceRepository.delete(id);

        // 發布任務實例刪除事件
        new TaskInstanceDeletedEvent(
            existingTaskInstance.id,
            existingTaskInstance.name,
            existingTaskInstance.projectId
        );

        return result;
    }

    /**
     * 根據 ID 獲取任務實例
     * @param id 任務實例 ID
     * @returns 任務實例或 null
     */
    async getTaskInstanceById(id: string): Promise<TaskInstance | null> {
        return await this.taskInstanceRepository.findById(id);
    }

    /**
     * 獲取專案下的所有任務實例
     * @param projectId 專案 ID
     * @returns 任務實例列表
     */
    async getTaskInstancesByProjectId(projectId: string): Promise<TaskInstance[]> {
        return await this.taskInstanceRepository.findByProjectId(projectId);
    }

    /**
     * 獲取工程下的所有任務實例
     * @param engineeringId 工程 ID
     * @returns 任務實例列表
     */
    async getTaskInstancesByEngineeringId(engineeringId: string): Promise<TaskInstance[]> {
        return await this.taskInstanceRepository.findByEngineeringId(engineeringId);
    }

    /**
     * 獲取所有任務實例
     * @returns 任務實例列表
     */
    async getAllTaskInstances(): Promise<TaskInstance[]> {
        return await this.taskInstanceRepository.findAll();
    }

    /**
     * 將基本任務實例轉換為富領域模型
     * @param taskInstance 基本任務實例
     * @returns 富領域模型
     */
    toRichModel(taskInstance: TaskInstance): RichTaskInstance {
        return TaskInstanceFactory.toRichModel(taskInstance);
    }

    /**
     * 批量轉換為富領域模型
     * @param taskInstances 基本任務實例列表
     * @returns 富領域模型列表
     */
    toRichModels(taskInstances: TaskInstance[]): RichTaskInstance[] {
        return taskInstances.map(taskInstance => this.toRichModel(taskInstance));
    }
}

/**
 * 為了向後兼容，提供 TaskInstanceDomainService 作為 TaskInstanceService 的別名
 * 應用層應優先使用這個類名
 */
export class TaskInstanceDomainService extends TaskInstanceService {
    constructor(taskInstanceRepository: TaskInstanceRepository) {
        super(taskInstanceRepository);
    }
}