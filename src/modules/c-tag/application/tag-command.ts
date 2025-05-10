import { CreateTagProps, Tag, TagType, UpdateTagProps } from '@/modules/c-tag/domain/entities/tag-entity';
import { ITagDomainService, TagDomainService } from '@/modules/c-tag/domain';
import { tagRepository } from '@/modules/c-tag/infrastructure/tag-repository';
import { tagUtil } from '@/modules/c-tag/infrastructure/tag-util';

// Command UseCase: 只負責資料修改
export class TagCommandService {
    constructor(private readonly domainService: ITagDomainService) { }

    async createTag(data: CreateTagProps): Promise<Tag> {
        const formattedName = tagUtil.formatTagName(data.name);
        const type = data.type ?? TagType.GENERAL;
        const color = data.color ?? tagUtil.getTagTypeColor(type);
        return this.domainService.createTag({ ...data, name: formattedName, type, color });
    }

    async updateTag(id: string, data: UpdateTagProps): Promise<Tag> {
        const updateData: UpdateTagProps = {};
        if (data.name !== undefined) updateData.name = tagUtil.formatTagName(data.name);
        if (data.type !== undefined) updateData.type = data.type;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.color !== undefined) updateData.color = data.color;
        if (data.type !== undefined && data.color === undefined) {
            updateData.color = tagUtil.getTagTypeColor(data.type);
        }
        return this.domainService.updateTag(id, updateData);
    }

    async deleteTag(id: string): Promise<void> {
        return this.domainService.deleteTag(id);
    }
}

const domainService = new TagDomainService(tagRepository);
export const tagCommandService = new TagCommandService(domainService);
