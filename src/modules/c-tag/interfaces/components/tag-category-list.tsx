'use client';

import { Tag, TagType } from '@/modules/c-tag/domain/tag-entity';
import { useDeleteTag } from '../hooks/useTagMutations';
import { tagDisplayUtils } from '../utils/tag-display-utils';

interface Props { tags: Tag[]; onDelete?: () => void; }
export default function TagCategoryListClient({ tags, onDelete }: Props) {
  const { mutate: deleteMutate, status } = useDeleteTag();
  const isDeleting = status === 'pending';

  if (!tags || tags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <svg width="48" height="48" fill="none" className="mb-2"><circle cx="24" cy="24" r="22" stroke="#cbd5e1" strokeWidth="2" /><path d="M16 24h16M24 16v16" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" /></svg>
        <p className="text-lg">目前沒有標籤</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tags.map(tag => {
        const bg = tagDisplayUtils.getTagTypeColor(tag.type as TagType);
        const textColor = tagDisplayUtils.getTagTypeTextColor(tag.type as TagType);
        return (
          <div key={tag.id} className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-lg transition-shadow">
            <h3 className="font-medium text-lg mb-2">{tag.name}</h3>
            <span
              className="inline-block px-3 py-1 text-xs rounded-full font-semibold mb-2"
              style={{
                backgroundColor: bg,
                color: textColor,
                border: `1.5px solid ${tagDisplayUtils.getTagTypeBorderColor(tag.type as TagType)}`,
                boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)'
              }}
            >
              {tagDisplayUtils.getTagTypeName(tag.type as TagType)}
            </span>
            <button
              onClick={() => {
                if (!confirm('確定刪除？')) return;
                deleteMutate(tag.id, { onSuccess: () => onDelete?.() });
              }}
              disabled={isDeleting}
              className="ml-2 text-red-600 hover:text-red-800 font-semibold disabled:opacity-50"
            >{isDeleting ? '刪除中...' : '刪除'}</button>
            {tag.description && (
              <p className="text-sm text-gray-600 mt-1">{tag.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
