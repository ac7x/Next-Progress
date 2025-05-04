import { UpdateProjectTemplateCommandHandler } from '@/modules/c-hub/application/project-template/project-template.command-handler';
import { GetProjectTemplateListQueryHandler } from '@/modules/c-hub/application/project-template/project-template.query-handler';

// Controller: 對外暴露查詢專案模板列表
export async function getProjectTemplateListHandler() {
    return GetProjectTemplateListQueryHandler();
}

export async function updateProjectTemplateHandler(
    id: string,
    data: Partial<import('@/modules/c-hub/domain/project-template/project-template-entity').CreateProjectTemplateProps>
) {
    return UpdateProjectTemplateCommandHandler(id, data);
}
