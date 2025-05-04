'use client';

import { Tag, TagType } from '@/modules/c-tag/domain/tag-entity';
import { useState } from 'react';
import { deleteTagAction } from '../actions';
import { tagDisplayUtils } from '../utils/tag-display-utils';

interface Props { tags: Tag[]; }
export default function TagCategoryListClient({ tags }: Props) {
  const [list, setList] = useState(tags);

  async function onDelete(id: string) {
    if (!confirm('確定刪除？')) return;
    await deleteTagAction(id);
    setList(list.filter(t => t.id !== id));
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {list.map(tag => (
        <div key={tag.id} className="p-4 border rounded">
          <h3>{tag.name}</h3>
          <span
            className="inline-block px-2 py-1 text-xs rounded"
            style={{ backgroundColor: tagDisplayUtils.getTagTypeColor(tag.type as TagType) }}
          >
            {tagDisplayUtils.getTagTypeName(tag.type as TagType)}
          </span>
          <button onClick={() => onDelete(tag.id)} className="text-red-600">刪除</button>
        </div>
      ))}
    </div>
  );
}
