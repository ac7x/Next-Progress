import { UpdateProjectTemplateCommandHandler } from '@/modules/c-hub/application/project-template/project-template.command-handler';
import { GetProjectTemplateListQueryHandler } from '@/modules/c-hub/application/project-template/project-template.query-handler';

// CQRS: Query Controller，只負責查詢
export async function getProjectTemplateListHandler() {
    return GetProjectTemplateListQueryHandler();
}

// CQRS: Command Controller，只負責更新
export async function updateProjectTemplateHandler(
    id: string,
    data: Partial<import('@/modules/c-hub/domain/project-template/project-template-entity').CreateProjectTemplateProps>
) {
    return UpdateProjectTemplateCommandHandler(id, data);
}
