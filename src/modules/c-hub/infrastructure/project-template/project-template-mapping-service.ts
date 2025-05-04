import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import type { Prisma } from '@prisma/client';

export const projectTemplateMappingService = {
  toDomain(prismaModel: any): ProjectTemplate {
    return {
      id: prismaModel.id,
      name: prismaModel.name,
      description: prismaModel.description,
      isActive: prismaModel.isActive,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt,
    };
  },

  toPersistence(domainModel: ProjectTemplate): Prisma.ProjectTemplateCreateInput {
    return {
      id: domainModel.id,
      name: domainModel.name,
      description: domainModel.description,
      isActive: domainModel.isActive,
    };
  }
};
