import { CreateTaskInstanceProps, TaskInstance, UpdateTaskInstanceProps } from '../entities';

/**
 * 任務實例儲存庫介面
 * 定義對任務實例的持久化操作
 */
export interface TaskInstanceRepository {
    /**
     * 根據 ID 獲取任務實例
     */
    findById(id: string): Promise<TaskInstance | null>;

    /**
     * 查詢所有任務實例
     */
    findAll(): Promise<TaskInstance[]>;

    /**
     * 查詢特定專案下的所有任務實例
     */
    findByProjectId(projectId: string): Promise<TaskInstance[]>;

    /**
     * 查詢特定工程下的任務實例
     */
    findByEngineeringId(engineeringId: string): Promise<TaskInstance[]>;

    /**
     * 創建新的任務實例
     */
    create(taskInstance: CreateTaskInstanceProps): Promise<TaskInstance>;

    /**
     * 更新任務實例
     */
    update(id: string, taskInstance: UpdateTaskInstanceProps): Promise<TaskInstance>;

    /**
     * 刪除任務實例
     */
    delete(id: string): Promise<boolean>;

    /**
     * 查詢符合條件的任務實例
     */
    findByFilter(filter: Partial<TaskInstance>): Promise<TaskInstance[]>;
}