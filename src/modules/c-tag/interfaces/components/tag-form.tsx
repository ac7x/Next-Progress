'use client';

import { TagType } from '@/modules/c-tag/domain/entities/tag-entity';
import { FormEvent, useState } from 'react';
import { useCreateTag } from '../hooks/useTagMutations';
import { tagDisplayUtils } from '../utils/tag-display-utils';

export default function TagFormClient() {
  const [name, setName] = useState('');
  const [type, setType] = useState<TagType>(TagType.GENERAL);
  const [desc, setDesc] = useState('');
  const { mutate, isPending, isSuccess, isError, error, reset } = useCreateTag();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      { name, type, description: desc || null },
      {
        onSuccess: () => {
          setName('');
          setDesc('');
          setType(TagType.GENERAL);
        }
      }
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md border">
      {isSuccess && <div className="p-2 text-green-600 bg-green-50 rounded">建立成功</div>}
      {isError && <div className="p-2 text-red-600 bg-red-50 rounded">{error?.message || '建立失敗'}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">名稱</label>
        <input value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">類型</label>
        <select
          value={type}
          onChange={e => setType(e.target.value as TagType)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200"
        >
          {Object.values(TagType).map(v => (
            <option key={v} value={v}>
              {tagDisplayUtils.getTagTypeName(v as TagType)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">描述</label>
        <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200" />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors font-semibold shadow" disabled={isPending}>
        {isPending ? '建立中...' : '建立標籤'}
      </button>
    </form>
  );
}
