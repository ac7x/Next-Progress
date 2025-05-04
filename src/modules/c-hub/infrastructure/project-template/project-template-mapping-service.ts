import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import type { Prisma } from '@prisma/client';

// 只負責 Prisma <-> Domain 的映射
export const projectTemplateMappingService = {
  toDomain(prismaModel: any): ProjectTemplate {
    return {
      id: prismaModel.id,
      name: prismaModel.name,
      description: prismaModel.description,
      isActive: prismaModel.isActive,
      priority: prismaModel.priority ?? 0, // 新增 priority
      createdAt: prismaModel.createdAt instanceof Date ? prismaModel.createdAt : new Date(prismaModel.createdAt),
      updatedAt: prismaModel.updatedAt instanceof Date ? prismaModel.updatedAt : new Date(prismaModel.updatedAt),
    };
  },

  toPersistence(domainModel: ProjectTemplate): Prisma.ProjectTemplateCreateInput {
    return {
      id: domainModel.id,
      name: domainModel.name,
      description: domainModel.description,
      isActive: domainModel.isActive,
      priority: domainModel.priority ?? 0, // 新增 priority
    };
  }
};
