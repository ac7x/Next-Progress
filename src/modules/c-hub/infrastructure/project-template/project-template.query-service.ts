import { ProjectTemplate, isValidProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';

// Query Service: 只負責查詢資料庫中的專案模板列表
export const ProjectTemplateQueryService = {
    async list(): Promise<ProjectTemplate[]> {
        try {
            const templates = await prisma.projectTemplate.findMany({
                where: { isActive: true },
                orderBy: { createdAt: 'desc' },
            });
            // 保證回傳的 createdAt/updatedAt 為 Date 型別且型別安全
            return Array.isArray(templates)
                ? templates
                    .map(t => ({
                        ...t,
                        createdAt: t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt),
                        updatedAt: t.updatedAt instanceof Date ? t.updatedAt : new Date(t.updatedAt),
                    }))
                    .filter(isValidProjectTemplate)
                : [];
        } catch (err) {
            console.error('ProjectTemplateQueryService.list error:', err);
            return [];
        }
    },
};
