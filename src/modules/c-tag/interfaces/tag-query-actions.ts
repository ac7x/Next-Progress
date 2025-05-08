'use server';

import { tagQueryService } from '@/modules/c-tag/application/tag-query';
import { Tag, TagType } from '@/modules/c-tag/domain/tag-entity';

// Query Server Actions
export async function getTags(): Promise<Tag[]> {
    return tagQueryService.listTags();
}

export async function getTag(id: string): Promise<Tag | null> {
    return tagQueryService.getTagById(id);
}

export async function getTagsByType(type: TagType): Promise<Tag[]> {
    return tagQueryService.listTagsByType(type);
}
