import { ProjectTemplateQueryService } from '@/modules/c-hub/infrastructure/project-template/project-template.query-service';

// Application QueryHandler: 查詢專案模板列表
// 只負責 Application Query Handler（查詢）
export async function GetProjectTemplateListQueryHandler() {
    return ProjectTemplateQueryService.list();
}
