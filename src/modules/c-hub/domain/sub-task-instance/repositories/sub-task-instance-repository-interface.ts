import { CreateSubTaskInstanceProps, SubTaskInstance, UpdateSubTaskInstanceProps } from '../entities/sub-task-instance-entity';

/**
 * 子任務實體倉儲介面
 * 定義所有對子任務實體的持久化操作
 */
export interface ISubTaskInstanceRepository {
    /**
     * 建立新的子任務實體
     * @param data 子任務實體建立資料
     */
    create(data: CreateSubTaskInstanceProps): Promise<SubTaskInstance>;

    /**
     * 取得所有子任務實體列表
     */
    list(): Promise<SubTaskInstance[]>;

    /**
     * 透過ID查詢單一子任務實體
     * @param id 子任務實體ID
     */
    findById(id: string): Promise<SubTaskInstance | null>;

    /**
     * 透過任務ID查詢子任務實體列表
     * @param taskId 任務ID
     */
    findByTaskId(taskId: string): Promise<SubTaskInstance[]>;

    /**
     * 透過ID更新子任務實體
     * @param id 子任務實體ID
     * @param data 欲更新的資料
     */
    update(id: string, data: UpdateSubTaskInstanceProps): Promise<SubTaskInstance>;

    /**
     * 刪除子任務實體
     * @param id 子任務實體ID
     */
    delete(id: string): Promise<void>;
}