import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';

// Query Service: 只負責查詢資料庫中的專案模板列表
export const ProjectTemplateQueryService = {
    async list(): Promise<ProjectTemplate[]> {
        return prisma.projectTemplate.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    },
};
