// src/modules/c-tag/interfaces/tag-query-actions.ts
'use server';

import { TagQueryService } from '@/modules/c-tag/application/queries/tag-queries';
import { Tag, TagType } from '@/modules/c-tag/domain/entities/tag-entity';
import { TagDomainService } from '@/modules/c-tag/domain/services/tag-domain-service';
import { tagRepository } from '@/modules/c-tag/infrastructure/repositories/tag-repository';

// 初始化服務
const domainService = new TagDomainService(tagRepository);
const queryService = new TagQueryService(domainService);

// Query Server Actions
export async function getTags(): Promise<Tag[]> {
    return queryService.listTags();
}

export async function getTag(id: string): Promise<Tag | null> {
    return queryService.getTagById(id);
}

export async function getTagsByType(type: TagType): Promise<Tag[]> {
    return queryService.listTagsByType(type);
}