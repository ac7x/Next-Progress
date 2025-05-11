import {
  EngineeringTemplate,
  RichEngineeringTemplate,
  UpdateEngineeringTemplateProps
} from '@/modules/c-hub/domain/engineering-template';
import { EngineeringTemplateDescription } from '@/modules/c-hub/domain/engineering-template/value-objects/engineering-template-description.vo';
import { EngineeringTemplateName } from '@/modules/c-hub/domain/engineering-template/value-objects/engineering-template-name.vo';
import { EngineeringTemplatePriority } from '@/modules/c-hub/domain/engineering-template/value-objects/engineering-template-priority.vo';
import type { Prisma, EngineeringTemplate as PrismaEngineeringTemplate } from '@prisma/client';

export const engineeringTemplateAdapter = {
  // 從 Prisma 模型轉換為基礎領域模型
  toDomain(prismaModel: PrismaEngineeringTemplate): EngineeringTemplate {
    return {
      id: prismaModel.id,
      name: prismaModel.name,
      description: prismaModel.description,
      priority: prismaModel.priority ?? 0,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt
    };
  },

  // 將領域模型轉換為 Prisma 更新輸入
  toPersistence(domainModel: Partial<UpdateEngineeringTemplateProps>): Prisma.EngineeringTemplateUpdateInput {
    const data: Prisma.EngineeringTemplateUpdateInput = {};

    if (domainModel.name !== undefined) data.name = domainModel.name;
    if (domainModel.description !== undefined) data.description = domainModel.description;
    if (domainModel.priority !== undefined) data.priority = domainModel.priority;

    return data;
  },

  // 新增：將豐富領域模型轉換為安全的可序列化物件
  // 確保所有值物件都被轉換為原始 JavaScript 值
  toSerializable(model: EngineeringTemplate | RichEngineeringTemplate): EngineeringTemplate {
    // 檢查是否為豐富領域模型（含有值物件）
    if (this.isRichModel(model)) {
      // 如果是豐富領域模型，則從值物件中提取原始值
      return {
        id: model.id,
        name: model.name instanceof EngineeringTemplateName ? model.name.getValue() : String(model.name),
        description: model.description instanceof EngineeringTemplateDescription ?
          model.description.getValue() : model.description as string | null,
        priority: model.priority instanceof EngineeringTemplatePriority ?
          model.priority.getValue() : (typeof model.priority === 'number' ? model.priority : 0),
        createdAt: model.createdAt,
        updatedAt: model.updatedAt
      };
    }

    // 如果已經是基礎領域模型，確保所有字段都有正確的類型
    return {
      id: model.id,
      // 確保 name 是字符串
      name: String(model.name),
      // 處理可能為 null 的 description
      description: model.description as string | null,
      // 確保 priority 是數字
      priority: typeof model.priority === 'number' ? model.priority : 0,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt
    };
  },

  // 輔助方法：判斷是否為豐富領域模型
  isRichModel(model: unknown): boolean {
    return (
      model !== null &&
      typeof model === 'object' &&
      'name' in model &&
      'description' in model &&
      'priority' in model &&
      (
        (model.name instanceof EngineeringTemplateName) ||
        (model.description instanceof EngineeringTemplateDescription) ||
        (model.priority instanceof EngineeringTemplatePriority)
      )
    );
  }
};
