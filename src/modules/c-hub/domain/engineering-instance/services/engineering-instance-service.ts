/**
 * 工程實例領域服務 - 負責工程實例的業務邏輯
 * 處理不適合放在實體或值物件中的業務規則，特別是涉及多個實體間協調的邏輯
 */

import { CreateEngineeringInstanceProps, EngineeringInstance, UpdateEngineeringInstanceProps, isValidEngineeringInstance } from '../entities/engineering-instance-entity';
import { EngineeringInstanceCreatedEvent, EngineeringInstanceDeletedEvent, EngineeringInstanceUpdatedEvent } from '../events';
import { IEngineeringInstanceRepository } from '../repositories/engineering-instance-repository-interface';

/**
 * 工程實例領域服務，負責工程實例業務邏輯與驗證
 */
export class EngineeringInstanceDomainService {
    /**
     * 建構函數 - 注入依賴的儲存庫
     * @param repository 工程實例儲存庫
     */
    constructor(private readonly repository: IEngineeringInstanceRepository) { }

    /**
     * 獲取所有工程實例
     * @returns 工程實例列表
     */
    async list(): Promise<EngineeringInstance[]> {
        return this.repository.list();
    }

    /**
     * 根據ID獲取工程實例
     * @param id 工程實例ID
     * @returns 工程實例或null
     */
    async getById(id: string): Promise<EngineeringInstance | null> {
        if (!id?.trim()) {
            throw new Error('工程實例 ID 不能為空');
        }
        return this.repository.getById(id);
    }

    /**
     * 創建工程實例
     * @param data 工程實例創建資料
     * @returns 新創建的工程實例
     */
    async create(data: CreateEngineeringInstanceProps): Promise<EngineeringInstance> {
        this.validateCreate(data);

        const instance = await this.repository.create(data);
        if (!isValidEngineeringInstance(instance)) {
            throw new Error('無效的工程實例資料');
        }

        // 發布工程實例創建事件
        new EngineeringInstanceCreatedEvent(
            instance.id,
            instance.name.getValue(),
            instance.projectId
        );

        return instance;
    }

    /**
     * 更新工程實例
     * @param id 工程實例ID
     * @param data 需要更新的資料
     * @returns 更新後的工程實例
     */
    async update(id: string, data: UpdateEngineeringInstanceProps): Promise<EngineeringInstance> {
        if (!id?.trim()) {
            throw new Error('工程實例 ID 不能為空');
        }

        this.validateUpdate(data);
        const instance = await this.repository.update(id, data);

        // 發布工程實例更新事件
        new EngineeringInstanceUpdatedEvent(
            instance.id,
            instance.name.getValue()
        );

        return instance;
    }

    /**
     * 刪除工程實例
     * @param id 工程實例ID
     */
    async delete(id: string): Promise<void> {
        if (!id?.trim()) {
            throw new Error('工程實例 ID 不能為空');
        }

        try {
            // 先檢查工程實例是否存在
            const instance = await this.repository.getById(id);
            if (!instance) {
                throw new Error(`找不到ID為 ${id} 的工程實例，無法刪除`);
            }

            await this.repository.delete(id);

            // 發布工程實例刪除事件
            new EngineeringInstanceDeletedEvent(id);
        } catch (error) {
            // 重新拋出錯誤，保留原始錯誤信息
            throw error;
        }
    }

    /**
     * 獲取特定專案的工程實例列表
     * @param projectId 專案ID
     * @returns 屬於指定專案的工程實例列表
     */
    async listByProject(projectId: string): Promise<EngineeringInstance[]> {
        if (!projectId?.trim()) {
            throw new Error('專案 ID 不能為空');
        }
        return this.repository.listByProject(projectId);
    }

    /**
     * 驗證創建工程實例的輸入資料
     * @param data 創建資料
     */
    private validateCreate(data: CreateEngineeringInstanceProps): void {
        if (!data.name?.trim()) {
            throw new Error('工程實例名稱不能為空');
        }

        if (!data.projectId?.trim()) {
            throw new Error('必須指定關聯的專案ID');
        }

        if (data.name.length > 100) {
            throw new Error('工程實例名稱不能超過100個字符');
        }
    }

    /**
     * 驗證更新工程實例的輸入資料
     * @param data 更新資料
     */
    private validateUpdate(data: UpdateEngineeringInstanceProps): void {
        if (data.name !== undefined && !data.name.trim()) {
            throw new Error('工程實例名稱不能為空');
        }

        if (data.name && data.name.length > 100) {
            throw new Error('工程實例名稱不能超過100個字符');
        }
    }
}