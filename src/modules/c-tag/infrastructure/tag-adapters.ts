import { Tag } from '@/modules/c-tag/domain/tag-entity';
import { Tag as PrismaTag } from '@prisma/client';

export const tagAdapter = {
  toDomain(prismaTag: PrismaTag): Tag {
    if (!prismaTag) throw new Error('無法轉換空的標籤數據');
    return prismaTag as Tag;
  },
};
