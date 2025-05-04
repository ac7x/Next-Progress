'use server';
import { Tag } from '@/modules/c-tag/domain/tag-entity';
import { tagService } from './tag-service';

export async function listTagsQuery(): Promise<Tag[]> {
    return await tagService.listTags();
}
export async function listTagsByTypeQuery(type?: string): Promise<Tag[]> {
    if (!type || type === 'ALL') return tagService.listTags();
    return tagService.listTagsByType(type as any);
}
