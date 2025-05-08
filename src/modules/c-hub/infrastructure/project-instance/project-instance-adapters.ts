import { CreateProjectInstanceProps, ProjectInstance } from '@/modules/c-hub/domain/project-instance/entities/project-instance-entity';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import type { Prisma } from '@prisma/client';

// 定義默認系統用戶ID（可以修改為你系統中已存在的用戶ID）
const DEFAULT_SYSTEM_USER_ID = 'system';

export const projectInstanceAdapter = {
  toDomain(prismaProject: any): ProjectInstance {
    return {
      id: prismaProject.id,
      name: prismaProject.name,
      description: prismaProject.description,
      priority: prismaProject.priority ?? 0, // 確保為 number
      startDate: prismaProject.startDate,
      endDate: prismaProject.endDate,
      createdBy: prismaProject.createdBy ?? prismaProject.creator?.userId ?? '', // 修正型別
      createdAt: prismaProject.createdAt,
      updatedAt: prismaProject.updatedAt,
    };
  },

  toPersistence(domainProject: Partial<CreateProjectInstanceProps>): Prisma.ProjectInstanceUpdateInput {
    const data: Prisma.ProjectInstanceUpdateInput = {};

    // 只包含已定義的屬性
    if (domainProject.name !== undefined) {
      data.name = domainProject.name;
    }

    if (domainProject.description !== undefined) {
      data.description = domainProject.description;
    }

    // 使用類型斷言處理 priority 欄位
    if (domainProject.priority !== undefined) {
      (data as any).priority = domainProject.priority;
    }

    if (domainProject.startDate !== undefined) {
      // 只有當 startDate 不是 null 時才設置它
      if (domainProject.startDate !== null) {
        data.startDate = domainProject.startDate;
      }
    }

    if (domainProject.endDate !== undefined) {
      // 只有當 endDate 不是 null 時才設置它
      if (domainProject.endDate !== null) {
        data.endDate = domainProject.endDate;
      }
    }

    // 對於創建操作，需要處理必要的 creator 關聯
    if (domainProject.createdBy) {
      data.creator = {
        connect: { userId: domainProject.createdBy }
      };
    }

    return data;
  },

  toCreateInput: async function (data: CreateProjectInstanceProps): Promise<Prisma.ProjectInstanceCreateInput> {
    // 獲取或創建用戶
    const userId = data.createdBy || DEFAULT_SYSTEM_USER_ID;

    // 檢查 userId 是否存在
    let user = await prisma.user.findFirst({
      where: { userId: userId }
    });

    // 如果用戶不存在，則創建一個
    if (!user) {
      user = await prisma.user.create({
        data: {
          userId: userId,
          displayName: `User ${userId}`,
          role: 'USER'
        }
      });
    }

    // 僅傳遞 Prisma 支援的欄位，不傳 createdBy
    const createInput: Prisma.ProjectInstanceCreateInput = {
      name: data.name,
      description: data.description,
      startDate: data.startDate || new Date(),
      creator: {
        connect: { id: user.id }
      },
      priority: data.priority ?? 0,
    };

    // 添加 endDate 欄位（如果存在）
    if (data.endDate !== null && data.endDate !== undefined) {
      createInput.endDate = data.endDate;
    }

    return createInput;
  }
};
