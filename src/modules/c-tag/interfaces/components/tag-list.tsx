'use client';

import { Tag } from '@/modules/c-tag/domain/tag-entity';
import { useState } from 'react';
import { useDeleteTag } from '../hooks/useTagMutations';
import { tagDisplayUtils } from '../utils/tag-display-utils';
import { TagEditForm } from './tag-edit-form';

interface TagListProps {
  tags: Tag[];
  onDelete?: () => void;
}

export function TagList({ tags = [], onDelete }: TagListProps) {
  const { mutate: deleteMutate, status } = useDeleteTag();
  const isDeleting = status === 'pending';
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm('確定要刪除此標籤嗎？此操作無法復原。')) return;
    deleteMutate(id, { onSuccess: () => onDelete?.() });
  };

  if (!tags || tags.length === 0) {
    return <p className="text-gray-500">目前沒有標籤</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <div key={tag.id} className="p-4 border rounded-lg">
            {editingTagId === tag.id ? (
              <TagEditForm
                tagId={tag.id}
                onSuccess={() => setEditingTagId(null)}
                onCancel={() => setEditingTagId(null)}
              />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{tag.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingTagId(tag.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {isDeleting ? '刪除中...' : '刪除'}
                    </button>
                  </div>
                </div>

                <div className={`inline-block px-2 py-1 rounded text-xs my-2`} style={{ backgroundColor: tagDisplayUtils.getTagTypeColor(tag.type) }}>
                  {tagDisplayUtils.getTagTypeName(tag.type)}
                </div>

                {tag.description && (
                  <p className="text-sm text-gray-600 mt-1">{tag.description}</p>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  建立時間：{new Date(tag.createdAt).toLocaleDateString()}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TagList;
