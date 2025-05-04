'use client';

import { TagType } from '@/modules/c-tag/domain/tag-entity';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useCreateTag } from '../hooks/useTagMutations';
import { tagDisplayUtils } from '../utils/tag-display-utils';

export function TagForm() {
  const qc = useQueryClient();
  const { mutate, status, error: mutateError } = useCreateTag();
  const isLoading = status === 'pending';
  const isSuccess = status === 'success';

  const [name, setName] = useState('');
  const [type, setType] = useState<TagType>(TagType.GENERAL);
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    mutate(
      { name: name.trim(), type, description: description.trim() || null },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['tags'] });
          setName('');
          setDescription('');
          setType(TagType.GENERAL);
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mutateError && <div className="p-2 text-red-600 bg-red-50">{mutateError.message}</div>}
      {isSuccess && <div className="p-2 text-green-600 bg-green-50">標籤建立成功！</div>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">標籤名稱</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="輸入標籤名稱"
          required
          disabled={isLoading}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">標籤類型</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as TagType)}
          disabled={isLoading}
          className="w-full p-2 border rounded"
        >
          {Object.values(TagType).map((value) => (
            <option key={value} value={value}>
              {tagDisplayUtils.getTagTypeName(value)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">描述（可選）</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="輸入標籤描述"
          disabled={isLoading}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? '建立中...' : '建立標籤'}
      </button>
    </form>
  );
}

export default TagForm;
