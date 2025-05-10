// src/modules/c-tag/infrastructure/adapter/tag-adapter.ts
import { Tag as DomainTag, TagType } from '@/modules/c-tag/domain/entities/tag-entity';
import { Tag as PrismaTag } from '@prisma/client';

export const tagAdapter = {
  toDomain(prismaTag: PrismaTag): DomainTag {
    return {
      id: prismaTag.id,
      name: prismaTag.name,
      type: prismaTag.type as TagType,
      description: prismaTag.description,
      color: prismaTag.color,
      createdAt: prismaTag.createdAt,
      updatedAt: prismaTag.updatedAt
    };
  }
};