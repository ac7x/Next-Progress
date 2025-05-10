// src/modules/c-tag/application/queries/tag-query-handler.ts
'use server';

import { Tag, TagType } from '@/modules/c-tag/domain/entities/tag-entity';
import { TagDomainService } from '@/modules/c-tag/domain/services/tag-domain-service';
import { tagRepository } from '@/modules/c-tag/infrastructure/repositories/tag-repository';
import { TagQueryService } from './tag-queries';

// 初始化領域服務與查詢服務
const domainService = new TagDomainService(tagRepository);
const queryService = new TagQueryService(domainService);

/**
 * 取得所有標籤查詢處理器
 * @returns 所有標籤列表
 */
export async function GetTagListQueryHandler(): Promise<Tag[]> {
    try {
        return await queryService.listTags();
    } catch (error) {
        console.error('查詢標籤列表失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('查詢標籤列表失敗: ' + String(error));
    }
}

/**
 * 依ID取得標籤查詢處理器
 * @param id 標籤ID
 * @returns 標籤資料，如未找到則為 null
 */
export async function GetTagByIdQueryHandler(id: string): Promise<Tag | null> {
    try {
        return await queryService.getTagById(id);
    } catch (error) {
        console.error('查詢標籤失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('查詢標籤失敗: ' + String(error));
    }
}

/**
 * 依類型取得標籤查詢處理器
 * @param type 標籤類型
 * @returns 符合類型的標籤列表
 */
export async function GetTagsByTypeQueryHandler(type: TagType): Promise<Tag[]> {
    try {
        return await queryService.listTagsByType(type);
    } catch (error) {
        console.error(`查詢類型 ${type} 的標籤失敗:`, error);
        throw error instanceof Error
            ? error
            : new Error(`查詢類型 ${type} 的標籤失敗: ` + String(error));
    }
}

// 直接暴露 Server Actions 給界面層使用
export const getTags = GetTagListQueryHandler;
export const getTag = GetTagByIdQueryHandler;
export const getTagsByType = GetTagsByTypeQueryHandler;