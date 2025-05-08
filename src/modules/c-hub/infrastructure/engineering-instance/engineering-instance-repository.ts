import { CreateEngineeringInstanceProps, EngineeringInstance } from '@/modules/c-hub/domain/engineering-instance/engineering-instance-entity';
import { IEngineeringInstanceRepository } from '@/modules/c-hub/domain/engineering-instance/engineering-instance-repository';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { engineeringInstanceAdapter } from './engineering-instance-adapter';

export class EngineeringInstanceRepository implements IEngineeringInstanceRepository {
  async list(): Promise<EngineeringInstance[]> {
    const engineerings = await prisma.engineeringInstance.findMany();
    return engineerings.map(engineeringInstanceAdapter.toDomain);
  }

  async getById(id: string): Promise<EngineeringInstance | null> {
    const engineering = await prisma.engineeringInstance.findUnique({
      where: { id }
    });
    return engineering ? engineeringInstanceAdapter.toDomain(engineering) : null;
  }

  async create(data: CreateEngineeringInstanceProps): Promise<EngineeringInstance> {
    try {
      // 尋找或創建用戶
      const userId = data.userId || 'system';
      let user = await prisma.user.findFirst({ where: { userId } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            userId,
            displayName: `User ${userId}`,
            role: 'USER'
          }
        });
      }

      // 創建工程
      const engineering = await prisma.engineeringInstance.create({
        data: {
          name: data.name,
          description: data.description || null,
          project: {
            connect: { id: data.projectId }
          },
          user: {
            connect: { id: user.id }
          }
        }
      });

      return engineeringInstanceAdapter.toDomain(engineering);
    } catch (error) {
      console.error('Failed to create engineering:', error);
      throw error;
    }
  }

  async listByProject(projectId: string): Promise<EngineeringInstance[]> {
    const engineerings = await prisma.engineeringInstance.findMany({
      where: { projectId }
    });
    return engineerings.map(engineeringInstanceAdapter.toDomain);
  }
}

export const engineeringInstanceRepository = new EngineeringInstanceRepository();