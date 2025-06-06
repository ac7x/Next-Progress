import { CreateProjectInstanceProps, ProjectInstance } from '@/modules/c-hub/domain/project-instance/entities/project-instance-entity';
import { isValidProjectInstanceCreatedBy } from '@/modules/c-hub/domain/project-instance/value-objects/project-instance-created-by.vo';
import { isValidProjectInstanceDescription } from '@/modules/c-hub/domain/project-instance/value-objects/project-instance-description.vo';
import { isValidProjectInstanceName } from '@/modules/c-hub/domain/project-instance/value-objects/project-instance-name.vo';
import { isValidProjectInstancePriority } from '@/modules/c-hub/domain/project-instance/value-objects/project-instance-priority.vo';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import type { Prisma } from '@prisma/client';

// 定義默認系統用戶ID（可以修改為你系統中已存在的用戶ID）
const DEFAULT_SYSTEM_USER_ID = 'system';

export const projectInstanceAdapter = {
  toDomain(prismaProject: any): ProjectInstance {
    // 確保原始數據符合值物件的要求
    const name = prismaProject.name;
    if (!isValidProjectInstanceName(name)) {
      throw new Error(`Invalid project name: ${name}`);
    }

    const description = prismaProject.description;
    if (description !== null && !isValidProjectInstanceDescription(description)) {
      throw new Error(`Invalid project description`);
    }

    const createdBy = prismaProject.createdBy ?? prismaProject.creator?.userId ?? '';
    if (!isValidProjectInstanceCreatedBy(createdBy)) {
      throw new Error(`Invalid project createdBy: ${createdBy}`);
    }

    const priority = prismaProject.priority ?? 0;
    if (!isValidProjectInstancePriority(priority)) {
      throw new Error(`Invalid project priority: ${priority}`);
    }

    return {
      id: prismaProject.id,
      name,
      description,
      priority,
      startDate: prismaProject.startDate,
      endDate: prismaProject.endDate,
      createdBy,
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

    // 修正: 處理 startDate 欄位，符合 Prisma 型別要求
    if ('startDate' in domainProject) {
      // 使用 set 操作符來明確設定值（包括 null）
      data.startDate = domainProject.startDate === null
        ? { set: null as any } // 使用 as any 避免 TypeScript 的型別錯誤
        : domainProject.startDate;
    }

    // 修正: 處理 endDate 欄位，符合 Prisma 型別要求
    if ('endDate' in domainProject) {
      // 使用 set 操作符來明確設定值（包括 null）
      data.endDate = domainProject.endDate === null
        ? { set: null as any } // 使用 as any 避免 TypeScript 的型別錯誤
        : domainProject.endDate;
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
      // 修正: 根據 Prisma 的類型定義，startDate 是必須的欄位，不能省略
      // 如果 data.startDate 存在則使用，不存在則設為當前時間
      startDate: data.startDate || new Date(),
      creator: {
        connect: { id: user.id }
      },
      priority: data.priority ?? 0,
    };

    // 修正: 有條件地添加 endDate 欄位
    if (data.endDate) {
      createInput.endDate = data.endDate;
    }

    return createInput;
  }
};
