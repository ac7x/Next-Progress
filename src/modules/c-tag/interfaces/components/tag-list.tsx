'use client';

import { Tag } from '@/modules/c-tag/domain/entities/tag-entity';
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
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <svg width="48" height="48" fill="none" className="mb-2"><circle cx="24" cy="24" r="22" stroke="#cbd5e1" strokeWidth="2" /><path d="M16 24h16M24 16v16" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" /></svg>
        <p className="text-lg">目前沒有標籤</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tags.map((tag) => {
          const bg = tagDisplayUtils.getTagTypeColor(tag.type);
          const textColor = tagDisplayUtils.getTagTypeTextColor(tag.type);
          return (
            <div
              key={tag.id}
              className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-lg transition-shadow relative"
            >
              {editingTagId === tag.id ? (
                <TagEditForm
                  tagId={tag.id}
                  onSuccess={() => setEditingTagId(null)}
                  onCancel={() => setEditingTagId(null)}
                />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-lg">{tag.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingTagId(tag.id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 font-semibold"
                      >
                        {isDeleting ? '刪除中...' : '刪除'}
                      </button>
                    </div>
                  </div>

                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2"
                    style={{
                      backgroundColor: bg,
                      color: textColor,
                      border: `1.5px solid ${tagDisplayUtils.getTagTypeBorderColor(tag.type)}`,
                      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)'
                    }}
                  >
                    {tagDisplayUtils.getTagTypeName(tag.type)}
                  </div>

                  {tag.description && (
                    <p className="text-sm text-gray-600 mt-1">{tag.description}</p>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    建立時間：{new Date(tag.createdAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TagList;
