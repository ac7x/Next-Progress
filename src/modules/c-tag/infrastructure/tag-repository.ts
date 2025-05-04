import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateTagProps, Tag, TagType, UpdateTagProps } from '@/modules/c-tag/domain/tag-entity';
import { ITagRepository } from '@/modules/c-tag/domain/tag-repository';
import { tagAdapter } from './tag-adapters';

export class TagRepository implements ITagRepository {
  async list(): Promise<Tag[]> {
    try {
      // 添加排序以確保一致的數據展示
      const tags = await prisma.tag.findMany({
        orderBy: { createdAt: 'desc' }
      });

      // 添加日誌以便調試
      console.log(`Retrieved ${tags.length} tags from database`);

      return tags.map(tagAdapter.toDomain);
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  async listByType(type: TagType): Promise<Tag[]> {
    try {
      const tags = await prisma.tag.findMany({
        where: { type },
        orderBy: { createdAt: 'desc' }
      });

      return tags.map(tagAdapter.toDomain);
    } catch (error) {
      console.error(`Error fetching tags with type ${type}:`, error);
      throw error;
    }
  }

  async create(data: CreateTagProps): Promise<Tag> {
    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        type: data.type ? data.type : TagType.GENERAL,
        description: data.description
      }
    });
    return tagAdapter.toDomain(tag);
  }

  async delete(id: string): Promise<void> {
    await prisma.tag.delete({
      where: { id },
    });
  }

  async update(id: string, data: UpdateTagProps): Promise<Tag> {
    try {
      const updateData: any = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.type !== undefined) updateData.type = data.type;

      const tag = await prisma.tag.update({
        where: { id },
        data: updateData
      });

      return tagAdapter.toDomain(tag);
    } catch (error) {
      console.error(`Error updating tag ${id}:`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<Tag | null> {
    try {
      const tag = await prisma.tag.findUnique({
        where: { id }
      });

      return tag ? tagAdapter.toDomain(tag) : null;
    } catch (error) {
      console.error(`Error fetching tag ${id}:`, error);
      throw error;
    }
  }
}

export const tagRepository = new TagRepository();