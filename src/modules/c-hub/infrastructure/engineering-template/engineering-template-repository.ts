import { CreateEngineeringTemplateProps, EngineeringTemplate, UpdateEngineeringTemplateProps } from '@/modules/c-hub/domain/engineering-template';
import { IEngineeringTemplateRepository } from '@/modules/c-hub/domain/engineering-template';

import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { Prisma } from '@prisma/client';
import { engineeringTemplateAdapter } from './engineering-template-adapter';

export class EngineeringTemplateRepository implements IEngineeringTemplateRepository {
  async create(data: CreateEngineeringTemplateProps): Promise<EngineeringTemplate> {
    try {
      const createData: Prisma.EngineeringTemplateCreateInput = {
        name: data.name,
        description: data.description || null,
        priority: data.priority ?? 0 // 新增
      };

      const prismaTemplate = await prisma.engineeringTemplate.create({
        data: createData
      });

      return engineeringTemplateAdapter.toDomain(prismaTemplate);
    } catch (error) {
      console.error('Failed to create engineering template:', error);
      throw error;
    }
  }

  async list(): Promise<EngineeringTemplate[]> {
    const prismaTemplates = await prisma.engineeringTemplate.findMany();

    return prismaTemplates.map(template => engineeringTemplateAdapter.toDomain(template));
  }

  async getById(id: string): Promise<EngineeringTemplate | null> {
    const prismaTemplate = await prisma.engineeringTemplate.findUnique({
      where: { id }
    });

    if (!prismaTemplate) return null;

    return engineeringTemplateAdapter.toDomain(prismaTemplate);
  }

  async update(id: string, data: UpdateEngineeringTemplateProps): Promise<EngineeringTemplate> {
    const updateData: Prisma.EngineeringTemplateUpdateInput = engineeringTemplateAdapter.toPersistence(data);

    const prismaTemplate = await prisma.engineeringTemplate.update({
      where: { id },
      data: updateData
    });

    return engineeringTemplateAdapter.toDomain(prismaTemplate);
  }

  async delete(id: string): Promise<void> {
    try {
      // 使用 deleteMany 而非 delete，這樣如果記錄不存在也不會拋出錯誤
      const result = await prisma.engineeringTemplate.deleteMany({
        where: { id }
      });

      // 如果實際上沒有記錄被刪除，我們可以選擇是否拋出錯誤
      if (result.count === 0) {
        console.warn(`ID為 ${id} 的工程模板不存在或已被刪除`);
      }
    } catch (error) {
      // 確保特定處理 Prisma 的 P2025 錯誤
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          console.warn(`ID為 ${id} 的工程模板不存在或已被刪除`);
          return; // 不拋出錯誤，靜默處理
        }
      }
      console.error('Delete engineering template error:', error);
      throw error;
    }
  }
}

export const engineeringTemplateRepository = new EngineeringTemplateRepository();
