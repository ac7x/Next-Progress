import { UpdateProjectTemplateCommandHandler } from '@/modules/c-hub/application/project-template/project-template.command-handler';
import { GetProjectTemplateListQueryHandler } from '@/modules/c-hub/application/project-template/project-template.query-handler';

// 只負責對外暴露查詢/更新專案模板
export async function getProjectTemplateListHandler() {
    return GetProjectTemplateListQueryHandler();
}

export async function updateProjectTemplateHandler(
    id: string,
    data: Partial<import('@/modules/c-hub/domain/project-template/project-template-entity').CreateProjectTemplateProps>
) {
    return UpdateProjectTemplateCommandHandler(id, data);
}
