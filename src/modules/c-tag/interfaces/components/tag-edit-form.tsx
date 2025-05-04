'use client';

import { TagType } from '@/modules/c-tag/domain/tag-entity';
import { useIsMutating, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTag } from '../hooks/useTag';
import { useUpdateTag } from '../hooks/useTagMutations';
import { tagDisplayUtils } from '../utils/tag-display-utils';

interface TagEditFormProps {
  tagId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TagEditForm({ tagId, onSuccess, onCancel }: TagEditFormProps) {
  const qc = useQueryClient();
  const router = useRouter();
  const { data: tag, isLoading, error: fetchError } = useTag(tagId);
  const { mutate, error: submitError } = useUpdateTag();
  const isSubmitting = useIsMutating({ mutationKey: ['tag', 'update'] }) > 0;

  const [name, setName] = useState('');
  const [type, setType] = useState<TagType>(TagType.GENERAL);
  const [description, setDescription] = useState('');

  // 初始填值
  useEffect(() => {
    if (tag) {
      setName(tag.name);
      setType(tag.type);
      setDescription(tag.description || '');
    }
  }, [tag]);

  if (isLoading) {
    return <div className="p-4 text-center">載入中...</div>;
  }
  if (!tag) {
    return <div className="p-4 text-red-500">{fetchError?.message || '找不到標籤'}</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutate(
      { id: tagId, data: { name, type, description: description.trim() || null } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['tags'] });
          qc.invalidateQueries({ queryKey: ['tag', tagId] });
          onSuccess?.();
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && <div className="p-2 text-red-600 bg-red-50 rounded">{submitError.message}</div>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">標籤名稱</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          disabled={isSubmitting}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">標籤類型</label>
        <select
          id="type"
          value={type}
          onChange={e => setType(e.target.value as TagType)}
          disabled={isSubmitting}
          className="w-full p-2 border rounded"
        >
          {Object.values(TagType).map(v => (
            <option key={v} value={v}>{tagDisplayUtils.getTagTypeName(v)}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">描述（可選）</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={isSubmitting}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? '儲存中...' : '儲存變更'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          取消
        </button>
      </div>
    </form>
  );
}

export default TagEditForm;
