import { EngineeringInstance } from '@/modules/c-hub/domain/engineering-instance/engineering-instance-entity';
import type { EngineeringInstance as PrismaEngineeringInstance } from '@prisma/client';

export const engineeringInstanceAdapter = {
  toDomain(prismaEngineering: PrismaEngineeringInstance): EngineeringInstance {
    return {
      id: prismaEngineering.id,
      name: prismaEngineering.name,
      description: prismaEngineering.description,
      projectId: prismaEngineering.projectId,
      userId: prismaEngineering.userId,
      createdAt: prismaEngineering.createdAt,
      updatedAt: prismaEngineering.updatedAt
    };
  }
};
