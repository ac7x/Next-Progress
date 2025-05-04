import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateTagProps, Tag, TagType, UpdateTagProps } from '@/modules/c-tag/domain/tag-entity';
import { ITagRepository } from '@/modules/c-tag/domain/tag-repository';
import { tagAdapter } from './tag-adapters';

export class TagRepository implements ITagRepository {
  async list(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({ orderBy: { createdAt: 'desc' } });
    return tags.map(tagAdapter.toDomain);
  }
  async listByType(type: TagType): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({ where: { type }, orderBy: { createdAt: 'desc' } });
    return tags.map(tagAdapter.toDomain);
  }
  async create(data: CreateTagProps): Promise<Tag> {
    const tag = await prisma.tag.create({
      data: ({
        name: data.name,
        type: data.type as TagType,
        description: data.description,
        color: data.color           // 新增
      }) as any                       // 繞過型別
    });
    return tagAdapter.toDomain(tag);
  }
  async delete(id: string): Promise<void> {
    await prisma.tag.delete({ where: { id } });
  }
  async update(id: string, data: UpdateTagProps): Promise<Tag> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.color !== undefined) updateData.color = data.color;  // 新增
    const tag = await prisma.tag.update({ where: { id }, data: updateData });
    return tagAdapter.toDomain(tag);
  }
  async getById(id: string): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({ where: { id } });
    return tag ? tagAdapter.toDomain(tag) : null;
  }
}

export const tagRepository = new TagRepository();