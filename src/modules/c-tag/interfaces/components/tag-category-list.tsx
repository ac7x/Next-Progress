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

export function TagCategoryList({ tags = [], onDelete }: TagCategoryListProps) {
  const [selectedType, setSelectedType] = useState<TagType | 'ALL'>('ALL');

  const filteredTags = selectedType === 'ALL'
    ? tags
    : tags.filter(tag => tag.type === selectedType);

  const groupedTags = selectedType === 'ALL'
    ? tagDisplayUtils.groupTagsByType(tags)
    : { [selectedType]: filteredTags } as Partial<Record<TagType, Tag[]>>; // 修正類型

  const orderedTypes = Object.keys(groupedTags).sort((a, b) => {
    const typeOrder = Object.values(TagType);
    return typeOrder.indexOf(a as TagType) - typeOrder.indexOf(b as TagType);
  });

  return (
    <div>
      <TagTypeFilter
        selectedType={selectedType}
        onChangeAction={(type: TagType | 'ALL') => setSelectedType(type)} // 修正名稱與類型
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
