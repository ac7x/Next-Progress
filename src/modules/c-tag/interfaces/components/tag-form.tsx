'use client';

import { TagType } from '@/modules/c-tag/domain/tag-entity';
import { FormEvent, useState } from 'react';
import { createTagAction } from '../actions';

export default function TagFormClient() {
  const [name, setName] = useState('');
  const [type, setType] = useState<TagType>(TagType.GENERAL);
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await createTagAction({ name, type, description: desc || null });
      setMsg('建立成功');
      setName(''); setDesc(''); setType(TagType.GENERAL);
    } catch (err) {
      setMsg('建立失敗');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md border">
      {msg && <div className="p-2 text-green-600 bg-green-50 rounded">{msg}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">名稱</label>
        <input value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">類型</label>
        <select value={type} onChange={e => setType(e.target.value as TagType)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200">
          {Object.values(TagType).map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">描述</label>
        <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200" />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors font-semibold shadow">
        建立標籤
      </button>
    </form>
  );
}
