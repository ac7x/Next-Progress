import { CreateProjectTemplateProps, ProjectTemplate } from '@/modules/c-hub/domain/project-template/entities/project-template-entity';
import { ProjectTemplateDomainService } from '@/modules/c-hub/domain/project-template/services/project-template-service';
import { projectTemplateRepository } from '@/modules/c-hub/infrastructure/project-template/adapter/project-template-repository';

// Application CommandHandler: 建立專案模板
export async function CreateProjectTemplateCommandHandler(
    data: CreateProjectTemplateProps
): Promise<ProjectTemplate> {
    // 1. 執行領域驗證與業務邏輯
    const domainService = new ProjectTemplateDomainService();
    domainService.validateTemplate(data);

    // 2. 產生領域物件（不含 id/createdAt，由 repository 實際產生）
    // 3. 實際寫入資料庫
    // 無需 revalidatePath，僅協調領域與儲存庫
    const created = await projectTemplateRepository.create(data);
    return created;
}

// Application CommandHandler: 更新專案模板
export async function UpdateProjectTemplateCommandHandler(
    id: string,
    data: Partial<CreateProjectTemplateProps>
): Promise<ProjectTemplate> {
    const domainService = new ProjectTemplateDomainService();
    domainService.validateTemplate(data); // 支援 Partial 型別
    // 無需 revalidatePath，僅協調領域與儲存庫
    return projectTemplateRepository.update(id, data);
}
