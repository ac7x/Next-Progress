import { Tag as DomainTag, TagType } from '@/modules/c-tag/domain/tag-entity';
import { Tag as PrismaTag } from '@prisma/client';

export const tagAdapter = {
  toDomain(prismaTag: PrismaTag): DomainTag {
    return {
      id: prismaTag.id,
      name: prismaTag.name,
      type: prismaTag.type as TagType,      // 明確轉為領域層 TagType
      description: prismaTag.description,
      color: prismaTag.color,               // 現在 DomainTag 已含 color
      createdAt: prismaTag.createdAt,
      updatedAt: prismaTag.updatedAt
    };
  },
};
