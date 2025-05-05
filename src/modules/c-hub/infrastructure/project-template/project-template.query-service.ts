import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';

// Query Service: 只負責查詢資料庫中的專案模板列表
export const ProjectTemplateQueryService = {
    async list(): Promise<ProjectTemplate[]> {
        try {
            // Prisma schema 已保證 priority 為 number（預設 0），不會為 null
            return prisma.projectTemplate.findMany({
                orderBy: { createdAt: 'desc' },
            }) as unknown as ProjectTemplate[];
        } catch (err) {
            console.error('ProjectTemplateQueryService.list error:', err);
            return [];
        }
    },
};
