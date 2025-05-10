/**
 * 任務實例領域服務
 * 
 * 這個服務封裝了核心的領域業務邏輯，確保領域規則的一致性。
 * 注意：此文件為了向後兼容保留，新代碼應使用 services/task-instance-service.ts
 */

import { TaskInstanceRepository } from './repositories';
import { TaskInstanceService } from './services/task-instance-service';

export class TaskInstanceDomainService extends TaskInstanceService {
    constructor(taskInstanceRepository: TaskInstanceRepository) {
        super(taskInstanceRepository);
    }
}
