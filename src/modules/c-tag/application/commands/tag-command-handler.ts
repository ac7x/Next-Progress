// src/modules/c-tag/application/commands/tag-command-handler.ts
'use server';

import { CreateTagProps, Tag, UpdateTagProps } from '@/modules/c-tag/domain/entities/tag-entity';
import { TagDomainService } from '@/modules/c-tag/domain/services/tag-domain-service';
import { tagRepository } from '@/modules/c-tag/infrastructure/repositories/tag-repository';
import { revalidatePath } from 'next/cache';
import { TagCommandService } from './tag-commands';

// 初始化領域服務與命令服務
const domainService = new TagDomainService(tagRepository);
const commandService = new TagCommandService(domainService);

/**
 * 建立標籤命令處理器
 * @param data 標籤建立資料
 * @returns 建立的標籤
 */
export async function CreateTagCommandHandler(data: CreateTagProps): Promise<Tag> {
    try {
        const tag = await commandService.createTag(data);
        // 重新驗證相關頁面
        revalidatePath('/client/dashboard');
        revalidatePath('/client/tag');
        return tag;
    } catch (error) {
        console.error('建立標籤失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('建立標籤失敗: ' + String(error));
    }
}

/**
 * 更新標籤命令處理器
 * @param id 標籤ID
 * @param data 標籤更新資料
 * @returns 更新後的標籤
 */
export async function UpdateTagCommandHandler(id: string, data: UpdateTagProps): Promise<Tag> {
    try {
        const tag = await commandService.updateTag(id, data);
        // 重新驗證相關頁面
        revalidatePath('/client/dashboard');
        revalidatePath('/client/tag');
        return tag;
    } catch (error) {
        console.error('更新標籤失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('更新標籤失敗: ' + String(error));
    }
}

/**
 * 刪除標籤命令處理器
 * @param id 標籤ID
 */
export async function DeleteTagCommandHandler(id: string): Promise<void> {
    try {
        await commandService.deleteTag(id);
        // 重新驗證相關頁面
        revalidatePath('/client/dashboard');
        revalidatePath('/client/tag');
    } catch (error) {
        console.error('刪除標籤失敗:', error);
        throw error instanceof Error
            ? error
            : new Error('刪除標籤失敗: ' + String(error));
    }
}