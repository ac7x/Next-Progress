'use server';

import { CreateTagProps, Tag, TagType, UpdateTagProps } from '@/modules/c-tag/domain/tag-entity';
import { revalidatePath } from 'next/cache';
import { tagService } from './tag-service';

export async function createTag(data: CreateTagProps): Promise<Tag> {
  try {
    const tag = await tagService.createTag(data);

    // 確保標籤頁面和相關頁面即時更新
    revalidatePath('/client/dashboard');
    revalidatePath('/client/tag');

    return tag;
  } catch (error) {
    console.error('建立標籤失敗:', error);
    throw error instanceof Error
      ? error
      : new Error('建立標籤失敗：' + String(error));
  }
}

export async function deleteTag(id: string): Promise<void> {
  try {
    await tagService.deleteTag(id);

    // 確保標籤頁面和相關頁面即時更新
    revalidatePath('/client/dashboard');
    revalidatePath('/client/tag');
  } catch (error) {
    console.error('刪除標籤失敗:', error);
    throw error instanceof Error
      ? error
      : new Error('刪除標籤失敗：' + String(error));
  }
}

export async function listTags(): Promise<Tag[]> {
  try {
    const tags = await tagService.listTags();
    console.log(`Server Action: Retrieved ${tags.length} tags`);
    return tags;
  } catch (error) {
    console.error('獲取標籤列表失敗:', error);
    return [];
  }
}

export async function listTagsByType(type?: TagType): Promise<Tag[]> {
  try {
    if (type) {
      return await tagService.listTagsByType(type);
    }
    return await tagService.listTags();
  } catch (error) {
    console.error('獲取標籤列表失敗:', error);
    return [];
  }
}

export async function getTagById(id: string): Promise<Tag | null> {
  try {
    return await tagService.getTagById(id);
  } catch (error) {
    console.error('獲取標籤詳情失敗:', error);
    return null;
  }
}

export async function updateTag(id: string, data: UpdateTagProps): Promise<Tag> {
  try {
    const tag = await tagService.updateTag(id, data);

    // 確保標籤頁面和相關頁面即時更新
    revalidatePath('/client/dashboard');
    revalidatePath('/client/tag');

    return tag;
  } catch (error) {
    console.error('更新標籤失敗:', error);
    throw error instanceof Error
      ? error
      : new Error('更新標籤失敗：' + String(error));
  }
}

export async function listTagsByIds(ids: string[]): Promise<Tag[]> {
  try {
    if (!ids || ids.length === 0) return [];

    const allTags = await tagService.listTags();
    return allTags.filter(tag => ids.includes(tag.id));
  } catch (error) {
    console.error('根據 ID 獲取標籤列表失敗:', error);
    return [];
  }
}
