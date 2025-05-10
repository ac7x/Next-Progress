import { CreateTaskTemplateProps, TaskTemplate, UpdateTaskTemplateProps } from '../entities';

/**
 * 任務模板存儲庫接口
 * 定義與持久化層交互的能力
 */
export interface ITaskTemplateRepository {
  /**
   * 創建任務模板
   * @param data 創建資料
   */
  create(data: CreateTaskTemplateProps): Promise<TaskTemplate>;
  
  /**
   * 獲取所有任務模板列表
   */
  list(): Promise<TaskTemplate[]>;
  
  /**
   * 根據ID獲取任務模板
   * @param id 任務模板ID
   */
  getById(id: string): Promise<TaskTemplate | null>;
  
  /**
   * 更新任務模板
   * @param id 任務模板ID
   * @param data 更新資料
   */
  update(id: string, data: Partial<UpdateTaskTemplateProps>): Promise<TaskTemplate>;
  
  /**
   * 刪除任務模板
   * @param id 任務模板ID
   */
  delete(id: string): Promise<void>;
  
  /**
   * 根據工程模板ID查找任務模板
   * @param engineeringTemplateId 工程模板ID
   */
  findByEngineeringTemplateId(engineeringTemplateId: string): Promise<TaskTemplate[]>;
}