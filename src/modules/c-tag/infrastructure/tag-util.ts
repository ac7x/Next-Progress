import { TagType } from '@/modules/c-tag/domain/tag-entity';
import { formatHex, hsl } from 'culori';

// 各類型顯示名稱與對應色相（Hue）
const TYPE_META: Record<TagType, { label: string; hue: number }> = {
  GENERAL: { label: '一般', hue: 210 },
  PROJECT_INSTANCE: { label: '專案實例', hue: 10 },
  PROJECT_TEMPLATE: { label: '專案範本', hue: 20 },
  ENGINEERING_INSTANCE: { label: '工程實例', hue: 30 },
  ENGINEERING_TEMPLATE: { label: '工程範本', hue: 40 },
  TASK_INSTANCE: { label: '任務實例', hue: 50 },
  TASK_TEMPLATE: { label: '任務範本', hue: 60 },
  SUBTASK_INSTANCE: { label: '子任務實例', hue: 70 },
  SUBTASK_TEMPLATE: { label: '子任務範本', hue: 80 },
  WAREHOUSE_INSTANCE: { label: '倉庫實例', hue: 110 },
  WAREHOUSE_ITEM: { label: '倉庫物品', hue: 140 },
};

export const tagUtil = {
  formatTagName: (name: string) => name.trim(),

  getTagTypeName: (type: TagType): string =>
    TYPE_META[type]?.label || type,

  getTagTypeColor: (type: TagType): string => {
    const meta = TYPE_META[type];
    const colorObj = hsl({ mode: 'hsl', h: meta?.hue ?? 0, s: 0.6, l: 0.7 });
    return formatHex(colorObj!);
  },
};
