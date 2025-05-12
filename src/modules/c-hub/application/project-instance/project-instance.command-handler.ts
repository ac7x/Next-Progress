import { getProjectTemplate } from '@/modules/c-hub/application/project-template/project-template-queries'; // Query Concern
import { CreateProjectInstanceProps, ProjectInstance } from '@/modules/c-hub/domain/project-instance/entities/project-instance-entity';
import { projectInstanceRepository } from '@/modules/c-hub/infrastructure/project-instance/repositories/project-instance-repository';

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
    // 查詢模板（Query Concern）
    const template = await getProjectTemplate(templateId);
    if (!template) throw new Error('找不到指定的專案模板');

    // 合併模板資料與 projectData，projectData 優先
    // 注意：startDate 為預計開始日期，可能是未來的日期，初始為空
    // createdAt 為專案建立時間，由系統自動設置為當前時間
    return projectInstanceRepository.create({
        ...projectData,
        name: projectData.name || template.name,
        description: projectData.description ?? template.description,
        priority: projectData.priority ?? template.priority ?? 0,
        createdBy: projectData.createdBy, // 確保傳遞正確
        // startDate 初始為空，將在專案列表中提供編輯功能
        // 結束日期初始為空，將在專案列表中提供編輯功能
    });
}
