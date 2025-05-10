import { TagType } from '@/modules/c-tag/domain/entities/tag-entity';
import { formatHex, hsl, wcagContrast } from 'culori';

// 定義每個標籤類型的色相
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

function getBgColor(hue: number, s = 0.6, l = 0.85) {
  return formatHex(hsl({ mode: 'hsl', h: hue, s, l })) ?? '#e5e7eb';
}
function getBorderColor(hue: number, s = 0.5, l = 0.7) {
  return formatHex(hsl({ mode: 'hsl', h: hue, s, l })) ?? '#cbd5e1';
}
function getTextColor(bg: string) {
  // 根據背景色自動選擇深色或白色字
  return wcagContrast(bg, '#1e293b') > 4.5 ? '#1e293b' : '#fff';
}

export const tagUtil = {
  formatTagName: (name: string) => name.trim(),

  getTagTypeName: (type: TagType): string =>
    TYPE_META[type].label,

  getTagTypeColor: (type: TagType): string => {
    const meta = TYPE_META[type];
    return getBgColor(meta.hue);
  },

  getTagTypeBorderColor: (type: TagType): string => {
    const meta = TYPE_META[type];
    return getBorderColor(meta.hue);
  },

  getTagTypeTextColor: (type: TagType): string => {
    const bg = tagUtil.getTagTypeColor(type);
    return getTextColor(bg);
  }
};
