import { Tag, TagType } from '@/modules/c-tag/domain/entities/tag-entity';
import { ITagDomainService, TagDomainService } from '@/modules/c-tag/domain';
import { tagRepository } from '@/modules/c-tag/infrastructure/tag-repository';

// Query UseCase: 只負責查詢
export class TagQueryService {
    constructor(private readonly domainService: ITagDomainService) { }

    async listTags(): Promise<Tag[]> {
        return this.domainService.listTags();
    }

    async listTagsByType(type: TagType): Promise<Tag[]> {
        return this.domainService.listTagsByType(type);
    }

    async getTagById(id: string): Promise<Tag | null> {
        return this.domainService.getTagById(id);
    }
}

const domainService = new TagDomainService(tagRepository);
export const tagQueryService = new TagQueryService(domainService);
