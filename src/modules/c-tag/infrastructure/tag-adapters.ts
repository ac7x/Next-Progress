import { Tag as DomainTag } from '@/modules/c-tag/domain/tag-entity';
import { Tag as PrismaTag } from '@prisma/client';

export const tagAdapter = {
  toDomain(prismaTag: PrismaTag): DomainTag {
    return {
      id: prismaTag.id,
      name: prismaTag.name,
      type: prismaTag.type as DomainTag['type'],
      description: prismaTag.description,
      color: prismaTag.color,         // 現在 domain Tag 支援此屬性
      createdAt: prismaTag.createdAt,
      updatedAt: prismaTag.updatedAt
    };
  },
};
