import {
    CreateSubTaskInstanceProps,
    SubTaskInstance,
    UpdateSubTaskInstanceProps
} from '../../domain/sub-task-instance/entities/sub-task-instance-entity';
import { SubTaskInstanceDomainService } from '../../domain/sub-task-instance/services/sub-task-instance-service';
import { SubTaskInstanceStatusType } from '../../domain/sub-task-instance/value-objects/sub-task-instance-status.vo';
import { subTaskInstanceRepository } from '../../infrastructure/sub-task-instance/repositories/sub-task-instance-repository';

/**
 * 子任務實體應用服務
 * 負責協調領域服務，做為應用層與領域層的橋樑
 */
export class SubTaskInstanceApplicationService {
    private readonly domainService: SubTaskInstanceDomainService;

    constructor() {
        this.domainService = new SubTaskInstanceDomainService(subTaskInstanceRepository);
    }

    /**
     * 創建新的子任務實體
     * @param data 子任務實體創建數據
     */
    async createSubTaskInstance(data: CreateSubTaskInstanceProps): Promise<SubTaskInstance> {
        return this.domainService.createSubTaskInstance(data);
    }

    /**
     * 更新子任務實體
     * @param id 子任務實體ID
     * @param data 更新數據
     */
    async updateSubTaskInstance(id: string, data: UpdateSubTaskInstanceProps): Promise<SubTaskInstance> {
        return this.domainService.updateSubTaskInstance(id, data);
    }

    /**
     * 刪除子任務實體
     * @param id 子任務實體ID
     */
    async deleteSubTaskInstance(id: string): Promise<void> {
        return this.domainService.deleteSubTaskInstance(id);
    }

    /**
     * 獲取子任務實體
     * @param id 子任務實體ID
     */
    async getSubTaskInstance(id: string): Promise<SubTaskInstance | null> {
        return this.domainService.getSubTaskInstanceById(id);
    }

    /**
     * 獲取特定任務的所有子任務實體
     * @param taskId 任務ID
     */
    async getSubTasksByTaskId(taskId: string): Promise<SubTaskInstance[]> {
        return this.domainService.listSubTasksInstanceByTaskId(taskId);
    }

    /**
     * 獲取所有子任務實體
     */
    async getAllSubTasks(): Promise<SubTaskInstance[]> {
        return this.domainService.listSubTasksInstance();
    }

    /**
     * 設置子任務狀態
     * @param id 子任務實體ID 
     * @param status 狀態
     */
    async setSubTaskStatus(id: string, status: SubTaskInstanceStatusType): Promise<SubTaskInstance> {
        return this.domainService.updateSubTaskInstanceStatus(id, status);
    }

    /**
     * 設置子任務完成率
     * @param id 子任務實體ID
     * @param completionRate 完成率
     */
    async setSubTaskCompletion(id: string, completionRate: number): Promise<SubTaskInstance> {
        return this.domainService.updateSubTaskInstanceCompletion(id, completionRate);
    }

    /**
     * 設置子任務實際設備數量
     * @param id 子任務實體ID
     * @param actualEquipmentCount 實際設備數量
     */
    async setSubTaskActualEquipment(id: string, actualEquipmentCount: number): Promise<SubTaskInstance> {
        return this.domainService.updateSubTaskInstance(id, { actualEquipmentCount });
    }

    /**
     * 開始子任務
     * @param id 子任務實體ID
     */
    async startSubTask(id: string): Promise<SubTaskInstance> {
        return this.domainService.updateSubTaskInstance(id, {
            status: 'IN_PROGRESS',
            startDate: new Date()
        });
    }

    /**
     * 完成子任務
     * @param id 子任務實體ID
     */
    async completeSubTask(id: string): Promise<SubTaskInstance> {
        return this.domainService.updateSubTaskInstance(id, {
            status: 'DONE',
            completionRate: 100,
            endDate: new Date()
        });
    }
}

/**
 * 子任務實體應用服務實例
 * 用於 Server Actions 和 API Routes
 */
export const subTaskInstanceService = new SubTaskInstanceApplicationService();