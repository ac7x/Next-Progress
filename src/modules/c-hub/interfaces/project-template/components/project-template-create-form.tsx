'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useProjectTemplateCreate } from '../hooks/project-template.create';

export function CreateProjectTemplateForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createTemplate, isCreating, error } = useProjectTemplateCreate();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTemplate({
        name,
        description: description || null,
      });
      setName('');
      setDescription('');
      router.refresh();
    } catch (error) {
      console.error('建立模板失敗:', error);
      alert('建立失敗，請稍後再試');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="模板名稱"
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="描述（可選）"
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        disabled={isCreating}
      >
        {isCreating ? '建立中...' : '建立專案模板'}
      </button>
      {error && (
        <div className="text-red-600 text-sm mt-2">{error}</div>
      )}
    </form>
  );
}
