'use client';

import { TagType } from '@/modules/c-tag/domain/entities/tag-entity';
import { tagDisplayUtils } from '../utils/tag-display-utils';

interface TagTypeFilterProps {
  selectedType: TagType | 'ALL';
  onChangeAction: (type: TagType | 'ALL') => void;
}

export function TagTypeFilter({ selectedType, onChangeAction }: TagTypeFilterProps) {
  const allTypes = [{ value: 'ALL', label: '全部標籤' } as const, ...Object.values(TagType).map((value) => ({
    value,
    label: tagDisplayUtils.getTagTypeName(value as TagType),
  }))];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {allTypes.map((type) => {
        const isActive = selectedType === type.value;
        const color = type.value !== 'ALL'
          ? tagDisplayUtils.getTagTypeColor(type.value as TagType)
          : '#e5e7eb';
        const textColor = type.value !== 'ALL'
          ? tagDisplayUtils.getTagTypeTextColor(type.value as TagType)
          : '#1e293b';
        return (
          <button
            key={type.value}
            onClick={() => onChangeAction(type.value)}
            style={{
              backgroundColor: isActive ? color : '#fff',
              color: isActive ? textColor : '#334155',
              borderColor: isActive ? color : '#cbd5e1',
              boxShadow: isActive ? '0 2px 8px 0 rgba(0,0,0,0.08)' : undefined,
              transition: 'all 0.2s'
            }}
            className={`px-3 py-1 rounded-full text-sm border font-medium focus:outline-none hover:shadow-md`}
          >
            {type.label}
          </button>
        );
      })}
    </div>
  );
}
