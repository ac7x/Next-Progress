import { TagType } from '@/modules/c-tag/domain/tag-entity';

// 固定顏色映射，避免運行時生成
const TYPE_COLORS: Record<TagType, string> = {
  GENERAL: '#4A90E2',
  PROJECT_INSTANCE: '#D0021B',
  PROJECT_TEMPLATE: '#F5A623',
  ENGINEERING_INSTANCE: '#7ED321',
  ENGINEERING_TEMPLATE: '#417505',
  TASK_INSTANCE: '#9013FE',
  TASK_TEMPLATE: '#BD10E0',
  SUBTASK_INSTANCE: '#50E3C2',
  SUBTASK_TEMPLATE: '#4A90E2',
  WAREHOUSE_INSTANCE: '#F8E71C',
  WAREHOUSE_ITEM: '#8B572A'
};

export const tagUtil = {
  formatTagName: (name: string) => name.trim(),

  getTagTypeName: (type: TagType): string => {
    const labels: Record<TagType, string> = {
      GENERAL: '一般',
      PROJECT_INSTANCE: '專案實例',
      PROJECT_TEMPLATE: '專案範本',
      ENGINEERING_INSTANCE: '工程實例',
      ENGINEERING_TEMPLATE: '工程範本',
      TASK_INSTANCE: '任務實例',
      TASK_TEMPLATE: '任務範本',
      SUBTASK_INSTANCE: '子任務實例',
      SUBTASK_TEMPLATE: '子任務範本',
      WAREHOUSE_INSTANCE: '倉庫實例',
      WAREHOUSE_ITEM: '倉庫物品'
    };
    return labels[type] || type;
  },

  getTagTypeColor: (type: TagType): string => {
    return TYPE_COLORS[type];
  },
};
