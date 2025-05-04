import { Tag, TagType } from '@/modules/c-tag/domain/tag-entity';
import { tagUtil } from '@/modules/c-tag/infrastructure/tag-util';

export const tagDisplayUtils = {
  /**
   * 獲取標籤類型名稱
   */
  getTagTypeName(type: TagType): string {
    return tagUtil.getTagTypeName(type);
  },

  /**
   * 獲取標籤類型顯示顏色
   */
  getTagTypeColor(type: TagType): string {
    return tagUtil.getTagTypeColor(type);
  },

  /**
   * 按類型分組標籤
   */
  groupTagsByType(tags: Tag[]): Record<string, Tag[]> {
    return tags.reduce((groups: Record<string, Tag[]>, tag) => {
      const type = tag.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(tag);
      return groups;
    }, {});
  },
};
