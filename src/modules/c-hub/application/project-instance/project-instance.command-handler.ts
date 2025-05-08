import { CreateProjectInstanceProps, ProjectInstance } from '@/modules/c-hub/domain/project-instance/project-instance-entity';
import { projectInstanceRepository } from '@/modules/c-hub/infrastructure/project-instance/project-instance-repository';

export async function CreateProjectInstanceCommandHandler(
    data: CreateProjectInstanceProps
): Promise<ProjectInstance> {
    // 可加上領域驗證
    return projectInstanceRepository.create(data);
}

export async function CreateProjectInstanceFromTemplateCommandHandler(
    templateId: string,
    projectData: Omit<CreateProjectInstanceProps, 'templateId'>
): Promise<ProjectInstance> {
    // 由 Application Service 負責協調查詢模板與建立專案
    // 實際查詢模板與組裝資料應在 Service 層完成
    return projectInstanceRepository.create(projectData);
}
