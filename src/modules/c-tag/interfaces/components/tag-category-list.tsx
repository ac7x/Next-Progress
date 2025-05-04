'use client';

import { Tag, TagType } from '@/modules/c-tag/domain/tag-entity';
import { useState } from 'react';
import { tagDisplayUtils } from '../utils/tag-display-utils';
import { TagList } from './tag-list';
import { TagTypeFilter } from './tag-type-filter';

interface TagCategoryListProps {
  tags: Tag[];
  onDelete?: () => void;
}

// 調整元件名稱與 props
export function TagCategoryList({ tags = [], onDelete }: TagCategoryListProps) {
  const [selectedType, setSelectedType] = useState<TagType | 'ALL'>('ALL');

  // 依據選擇的類型篩選標籤
  const filteredTags = selectedType === 'ALL'
    ? tags
    : tags.filter(tag => tag.type === selectedType);

  // 如果選擇「全部」，則按類型分組顯示
  const groupedTags = selectedType === 'ALL'
    ? tagDisplayUtils.groupTagsByType(tags)
    : { [selectedType]: filteredTags };

  // 將類型排序為有固定順序
  const orderedTypes = Object.keys(groupedTags).sort((a, b) => {
    const typeOrder = [
      TagType.GENERAL,
      TagType.PROJECT,
      TagType.PROJECT_TEMPLATE,
      TagType.ENGINEERING,
      TagType.ENGINEERING_TEMPLATE,
      TagType.WAREHOUSE,
      TagType.ITEM,
      TagType.TASK,
      TagType.TASK_TEMPLATE,
      TagType.SUBTASK,
      TagType.SUBTASK_TEMPLATE
    ];
    return typeOrder.indexOf(a as TagType) - typeOrder.indexOf(b as TagType);
  });

  return (
    <div>
      <TagTypeFilter
        selectedType={selectedType}
        onChange={(type) => setSelectedType(type)}
      />

      {orderedTypes.length === 0 ? (
        <p className="text-gray-500">目前沒有標籤</p>
      ) : (
        <div className="space-y-8">
          {orderedTypes.map(type => (
            <div key={type} className="space-y-2">
              <h3 className="font-medium text-lg">
                {tagDisplayUtils.getTagTypeName(type as TagType)}
              </h3>
              <TagList tags={groupedTags[type]} onDelete={onDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TagCategoryList;
