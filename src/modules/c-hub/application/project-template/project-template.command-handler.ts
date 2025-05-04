import { CreateProjectTemplateProps, ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { ProjectTemplateDomainService } from '@/modules/c-hub/domain/project-template/project-template-service';
import { projectTemplateRepository } from '@/modules/c-hub/infrastructure/project-template/project-template-repository';

// Application CommandHandler: 更新專案模板
export async function UpdateProjectTemplateCommandHandler(
    id: string,
    data: Partial<CreateProjectTemplateProps>
): Promise<ProjectTemplate> {
    const domainService = new ProjectTemplateDomainService(projectTemplateRepository);
    // 可加上額外驗證或授權
    return domainService.updateTemplate(id, data);
}
