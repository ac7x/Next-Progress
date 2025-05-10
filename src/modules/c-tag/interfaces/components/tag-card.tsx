'use client';

import { Tag, TagType } from '@/modules/c-tag/domain/entities/tag-entity';
import { tagDisplayUtils } from '@/modules/c-tag/interfaces/utils/tag-display-utils';

interface TagCardProps {
  tag: Tag;
}

export function TagCard({ tag }: TagCardProps) {
  return (
    <div className="border p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-2">{tag.name}</h3>
      <div
        className="inline-block px-2 py-1 rounded text-xs mb-3"
        style={{ backgroundColor: tagDisplayUtils.getTagTypeColor(tag.type as TagType) }}
      >
        {tagDisplayUtils.getTagTypeName(tag.type as TagType)}
      </div>
      {tag.description && (
        <p className="text-gray-600 mb-3">{tag.description}</p>
      )}
      <div className="text-sm text-gray-500">
        <p>建立時間: {new Date(tag.createdAt).toLocaleDateString()}</p>
        <p>更新時間: {new Date(tag.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default TagCard;
