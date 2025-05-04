import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';

// Query Service: 只負責查詢資料庫中的專案模板列表
export const ProjectTemplateQueryService = {
    async list(): Promise<ProjectTemplate[]> {
        const templates = await prisma.projectTemplate.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
        // 確保所有日期欄位為 string，避免 SSR 序列化失敗
        return templates.map(t => ({
            ...t,
            createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
            updatedAt: t.updatedAt instanceof Date ? t.updatedAt.toISOString() : t.updatedAt,
        })) as unknown as ProjectTemplate[];
    },
};
