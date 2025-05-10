// src/modules/c-tag/application/commands/tag-commands.ts
import { CreateTagProps, Tag, TagType, UpdateTagProps } from '@/modules/c-tag/domain/entities/tag-entity';
import { ITagDomainService } from '@/modules/c-tag/domain/services/tag-domain-service';
import { tagUtil } from '@/modules/c-tag/infrastructure/tag-util';

export class TagCommandService {
  constructor(private readonly domainService: ITagDomainService) {}

  async createTag(data: CreateTagProps): Promise<Tag> {
    const formattedName = tagUtil.formatTagName(data.name);
    const type = data.type ?? TagType.GENERAL;
    const color = data.color ?? tagUtil.getTagTypeColor(type);
    
    return this.domainService.createTag({
      ...data,
      name: formattedName,
      type,
      color
    });
  }

  async updateTag(id: string, data: UpdateTagProps): Promise<Tag> {
    const updateData: UpdateTagProps = {};
    
    if (data.name !== undefined) {
      updateData.name = tagUtil.formatTagName(data.name);
    }
    if (data.type !== undefined) {
      updateData.type = data.type;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.color !== undefined) {
      updateData.color = data.color;
    }
    
    // 若 type 有變動但 color 沒有指定，則自動帶入對應色
    if (data.type !== undefined && data.color === undefined) {
      updateData.color = tagUtil.getTagTypeColor(data.type);
    }
    
    return this.domainService.updateTag(id, updateData);
  }

  async deleteTag(id: string): Promise<void> {
    return this.domainService.deleteTag(id);
  }
}