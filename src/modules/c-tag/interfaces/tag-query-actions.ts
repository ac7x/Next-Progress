// src/modules/c-tag/interfaces/tag-query-actions.ts
'use server';

import { GetTagByIdQueryHandler, GetTagListQueryHandler, GetTagsByTypeQueryHandler } from '../application/queries/tag-query-handler';
import { TagType } from '../domain/entities/tag-entity';

// Query Server Actions - 介面層僅負責轉發請求到應用層的查詢處理器
export async function getTags() {
    return GetTagListQueryHandler();
}

export async function getTag(id: string) {
    return GetTagByIdQueryHandler(id);
}

export async function getTagsByType(type: TagType) {
    return GetTagsByTypeQueryHandler(type);
}