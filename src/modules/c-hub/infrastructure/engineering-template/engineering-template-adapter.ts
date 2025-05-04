import { EngineeringTemplate, UpdateEngineeringTemplateProps } from '@/modules/c-hub/domain/engineering-template/engineering-template-entity';
import type { Prisma, EngineeringTemplate as PrismaEngineeringTemplate } from '@prisma/client';

export const engineeringTemplateAdapter = {
  toDomain(prismaModel: PrismaEngineeringTemplate): EngineeringTemplate {
    return {
      id: prismaModel.id,
      name: prismaModel.name,
      description: prismaModel.description,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt
    };
  },

  toPersistence(domainModel: Partial<UpdateEngineeringTemplateProps>): Prisma.EngineeringTemplateUpdateInput {
    const data: Prisma.EngineeringTemplateUpdateInput = {};

    if (domainModel.name !== undefined) data.name = domainModel.name;
    if (domainModel.description !== undefined) data.description = domainModel.description;

    return data;
  }
};
