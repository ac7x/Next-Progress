// src/modules/c-tag/application/queries/tag-queries.ts
import { Tag, TagType } from '@/modules/c-tag/domain/entities/tag-entity';
import { ITagDomainService } from '@/modules/c-tag/domain/services/tag-domain-service';

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