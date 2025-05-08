import { UpdateProjectTemplateCommandHandler } from '@/modules/c-hub/application/project-template/project-template.command-handler';
import { GetProjectTemplateListQueryHandler } from '@/modules/c-hub/application/project-template/project-template.query-handler';

// CQRS: Query Controller，只負責查詢
export async function getProjectTemplateListHandler() {
    try {
        return await GetProjectTemplateListQueryHandler();
    } catch (error) {
        console.error('Failed to get project template list:', error);
        throw error instanceof Error ? error : new Error('Failed to get project template list');
    }
}

// CQRS: Command Controller，只負責更新
export async function updateProjectTemplateHandler(
    id: string,
    data: Partial<import('@/modules/c-hub/domain/project-template/project-template-entity').CreateProjectTemplateProps>
) {
    try {
        return await UpdateProjectTemplateCommandHandler(id, data);
    } catch (error) {
        console.error('Failed to update project template:', error);
        throw error instanceof Error ? error : new Error('Failed to update project template');
    }
}
