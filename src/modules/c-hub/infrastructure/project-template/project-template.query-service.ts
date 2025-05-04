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
            // 型別安全：確保 createdAt/updatedAt 為 Date，且每個欄位完整
            return Array.isArray(templates)
                ? templates
                    .map(t => ({
                        ...t,
                        createdAt: t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt),
                        updatedAt: t.updatedAt instanceof Date ? t.updatedAt : new Date(t.updatedAt),
                        description: t.description ?? null,
                        isActive: t.isActive ?? true,
                        priority: typeof t.priority === 'number' ? t.priority : 0,
                    }))
                    .filter(isValidProjectTemplate)
                : [];
        } catch (err) {
            console.error('ProjectTemplateQueryService.list error:', err);
            return [];
        }
    },
};
