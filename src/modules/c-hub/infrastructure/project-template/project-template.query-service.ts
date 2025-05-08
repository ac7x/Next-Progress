import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';

// Query Service: 只負責查詢資料庫中的專案模板列表
export const ProjectTemplateQueryService = {
    async list(): Promise<ProjectTemplate[]> {
        try {
            // 先依 priority 升冪，再依 createdAt 降冪
            return prisma.projectTemplate.findMany({
                orderBy: [
                    { priority: 'asc' },
                    { createdAt: 'desc' }
                ],
            }) as unknown as ProjectTemplate[];
        } catch (err) {
            console.error('ProjectTemplateQueryService.list error:', err);
            return [];
        }
    },
};
