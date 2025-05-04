import { Tag as DomainTag } from '@/modules/c-tag/domain/tag-entity';
import { Tag as PrismaTag } from '@prisma/client';

export const tagAdapter = {
  toDomain(prismaTag: PrismaTag): DomainTag {
    return {
      id: prismaTag.id,
      name: prismaTag.name,
      type: prismaTag.type,
      description: prismaTag.description,
      color: prismaTag.color,           // 新增
      createdAt: prismaTag.createdAt,
      updatedAt: prismaTag.updatedAt
    };
  },
};
