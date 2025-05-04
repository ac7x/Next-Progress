'use server';

import {
    tagCommandCreate,
    tagCommandDelete,
    tagCommandUpdate,
    tagQueryById,
    tagQueryList,
    tagQueryListByType
} from '@/modules/c-tag/application/tag-actions';
import { CreateTagProps, UpdateTagProps } from '@/modules/c-tag/domain/tag-entity';

// Query Actions
export async function getTags() {
    return await tagQueryList();
}

export async function getTag(id: string) {
    return await tagQueryById(id);
}

export async function getTagsByType(type: string) {
    return await tagQueryListByType(type as any);
}

// Command Actions
export async function createTagAction(data: CreateTagProps) {
    return await tagCommandCreate(data);
}

export async function updateTagAction(id: string, data: UpdateTagProps) {
    return await tagCommandUpdate(id, data);
}

export async function deleteTagAction(id: string) {
    return await tagCommandDelete(id);
}
