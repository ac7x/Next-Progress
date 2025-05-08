import { CreateProjectTemplateProps, ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { ProjectTemplateDomainService } from '@/modules/c-hub/domain/project-template/project-template-service';

// Application CommandHandler: 更新專案模板
// 只負責 Application Command Handler（更新）
export async function UpdateProjectTemplateCommandHandler(
    id: string,
    data: Partial<CreateProjectTemplateProps>
): Promise<ProjectTemplate> {
    const domainService = new ProjectTemplateDomainService(); // 修正：不傳 repository
    // 可加上額外驗證或授權
    return domainService.updateTemplate(id, data);
}
