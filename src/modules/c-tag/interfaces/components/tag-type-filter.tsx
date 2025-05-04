'use client';

import { TagType } from '@/modules/c-tag/domain/tag-entity';
import { tagDisplayUtils } from '../utils/tag-display-utils';

interface TagTypeFilterProps {
  selectedType: TagType | 'ALL';
  onChange: (type: TagType | 'ALL') => void;
}

export function TagTypeFilter({ selectedType, onChange }: TagTypeFilterProps) {
  // 所有標籤類型 + 全部選項
  const allTypes = [{ value: 'ALL', label: '全部標籤' } as const, ...Object.entries(TagType).map(([key, value]) => ({
    value,
    label: tagDisplayUtils.getTagTypeName(value as TagType)
  }))];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {allTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => onChange(type.value)}
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedType === type.value
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}
