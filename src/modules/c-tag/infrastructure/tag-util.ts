import { TagType } from '@prisma/client';

/**
 * 標籤處理工具類
 * 提供標籤的格式化和處理方法
 */
const TAG_TYPE_NAME_MAP: Record<TagType, string> = {
  [TagType.GENERAL]: '通用標籤',
  [TagType.PROJECT]: '專案相關',
  [TagType.PROJECT_TEMPLATE]: '專案模板',
  [TagType.ENGINEERING]: '工程相關',
  [TagType.ENGINEERING_TEMPLATE]: '工程模板',
  [TagType.WAREHOUSE]: '倉庫相關',
  [TagType.ITEM]: '物品相關',
  [TagType.TASK]: '任務相關',
  [TagType.TASK_TEMPLATE]: '任務模板',
  [TagType.SUBTASK]: '子任務相關',
  [TagType.SUBTASK_TEMPLATE]: '子任務模板',
};

const TAG_TYPE_COLOR_MAP: Record<TagType, string> = {
  [TagType.GENERAL]: 'bg-gray-100',
  [TagType.PROJECT]: 'bg-blue-100',
  [TagType.PROJECT_TEMPLATE]: 'bg-blue-200',
  [TagType.ENGINEERING]: 'bg-green-100',
  [TagType.ENGINEERING_TEMPLATE]: 'bg-green-200',
  [TagType.WAREHOUSE]: 'bg-yellow-100',
  [TagType.ITEM]: 'bg-teal-100',
  [TagType.TASK]: 'bg-purple-100',
  [TagType.TASK_TEMPLATE]: 'bg-purple-200',
  [TagType.SUBTASK]: 'bg-pink-100',
  [TagType.SUBTASK_TEMPLATE]: 'bg-pink-200',
};

export const tagUtil = {
  /**
   * 格式化標籤名稱 - 移除前後空白
   */
  formatTagName(name: string): string {
    return name.trim();
  },

  /**
   * 將標籤字串轉換為標籤數組
   */
  parseTagsString(tagsStr: string): string[] {
    if (!tagsStr || !tagsStr.trim()) {
      return [];
    }

    return tagsStr
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  },

  /**
   * 將標籤數組轉換為標籤字串
   */
  stringifyTags(tags: string[]): string {
    if (!tags || tags.length === 0) {
      return '';
    }

    return tags.join(', ');
  },

  /**
   * 獲取標籤類型名稱
   */
  getTagTypeName(type: TagType): string {
    return TAG_TYPE_NAME_MAP[type] || '未知類型';
  },

  /**
   * 獲取標籤類型顯示顏色
   */
  getTagTypeColor(type: TagType): string {
    return TAG_TYPE_COLOR_MAP[type] || 'bg-gray-100';
  },
};
