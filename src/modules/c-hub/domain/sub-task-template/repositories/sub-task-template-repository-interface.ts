import { CreateSubTaskTemplateProps, SubTaskTemplate, UpdateSubTaskTemplateProps } from '../entities/sub-task-template-entity';

/**
 * 子任務模板倉儲介面
 * 定義所有對子任務模板實體的持久化操作
 */
export interface ISubTaskTemplateRepository {
    /**
     * 建立新的子任務模板
     * @param data 子任務模板建立資料
     */
    create(data: CreateSubTaskTemplateProps): Promise<SubTaskTemplate>;

    /**
     * 取得所有子任務模板列表
     */
    list(): Promise<SubTaskTemplate[]>;

    /**
     * 透過ID查詢單一子任務模板
     * @param id 子任務模板ID
     */
    getById(id: string): Promise<SubTaskTemplate | null>;

    /**
     * 透過ID更新子任務模板
     * @param id 子任務模板ID
     * @param data 欲更新的資料
     */
    update(id: string, data: Partial<UpdateSubTaskTemplateProps>): Promise<SubTaskTemplate>;

    /**
     * 刪除子任務模板
     * @param id 子任務模板ID
     */
    delete(id: string): Promise<void>;

    /**
     * 查詢特定任務模板相關的子任務模板
     * @param taskTemplateId 任務模板ID
     */
    findByTaskTemplateId(taskTemplateId: string): Promise<SubTaskTemplate[]>;
}