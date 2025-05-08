import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { ProjectTemplateQueryService } from '@/modules/c-hub/infrastructure/project-template/project-template.query-service';

// Application QueryHandler: 查詢專案模板列表
export async function GetProjectTemplateListQueryHandler(): Promise<ProjectTemplate[]> {
    try {
        // 僅協調查詢服務，符合 CQRS
        return await ProjectTemplateQueryService.list();
    } catch (error) {
        console.error('Failed to get project template list:', error);
        throw error instanceof Error ? error : new Error('Failed to get project template list');
    }
}
