import { CreateTagProps, Tag, TagType, UpdateTagProps } from '@/modules/c-tag/domain/tag-entity';
import { ITagDomainService, TagDomainService } from '@/modules/c-tag/domain/tag-service';
import { tagRepository } from '@/modules/c-tag/infrastructure/tag-repository';
import { tagUtil } from '@/modules/c-tag/infrastructure/tag-util';

export class TagApplicationService {
  constructor(private readonly domainService: ITagDomainService) { }

  async listTags(): Promise<Tag[]> {
    return this.domainService.listTags();
  }

  async listTagsByType(type: TagType): Promise<Tag[]> {
    return this.domainService.listTagsByType(type);
  }

  async createTag(data: CreateTagProps): Promise<Tag> {
    const formattedName = tagUtil.formatTagName(data.name);
    const tagData = {
      ...data,
      name: formattedName,
      type: data.type || TagType.GENERAL
    };
    return this.domainService.createTag(tagData);
  }

  async deleteTag(id: string): Promise<void> {
    return this.domainService.deleteTag(id);
  }

  async getTagById(id: string): Promise<Tag | null> {
    return this.domainService.getTagById(id);
  }

  async updateTag(id: string, data: UpdateTagProps): Promise<Tag> {
    const updateData: UpdateTagProps = {};
    if (data.name !== undefined) updateData.name = tagUtil.formatTagName(data.name);
    if (data.type !== undefined) updateData.type = data.type;
    if (data.description !== undefined) updateData.description = data.description;
    return this.domainService.updateTag(id, updateData);
  }
}

const domainService = new TagDomainService(tagRepository);
export const tagService = new TagApplicationService(domainService);