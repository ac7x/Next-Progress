/**
 * 工程實例儲存庫介面 - 定義領域與持久化層的交互方式
 * 遵循依賴反轉原則，領域層只依賴於抽象介面，不依賴於具體實現
 */
import { CreateEngineeringInstanceProps, EngineeringInstance, UpdateEngineeringInstanceProps } from '../entities/engineering-instance-entity';

export interface IEngineeringInstanceRepository {
  /**
   * 獲取所有工程實例
   * @returns 工程實例列表
   */
  list(): Promise<EngineeringInstance[]>;

  /**
   * 根據ID獲取工程實例
   * @param id 工程實例ID
   * @returns 工程實例實體或null
   */
  getById(id: string): Promise<EngineeringInstance | null>;

  /**
   * 創建工程實例
   * @param data 工程實例創建資料
   * @returns 創建的工程實例實體
   */
  create(data: CreateEngineeringInstanceProps): Promise<EngineeringInstance>;

  /**
   * 更新工程實例
   * @param id 工程實例ID
   * @param data 需要更新的資料
   * @returns 更新後的工程實例實體
   */
  update(id: string, data: UpdateEngineeringInstanceProps): Promise<EngineeringInstance>;

  /**
   * 刪除工程實例
   * @param id 工程實例ID
   */
  delete(id: string): Promise<void>;

  /**
   * 根據專案ID獲取工程實例列表
   * @param projectId 專案ID
   * @returns 關聯到指定專案的工程實例列表
   */
  listByProject(projectId: string): Promise<EngineeringInstance[]>;
}