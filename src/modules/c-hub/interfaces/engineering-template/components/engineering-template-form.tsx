'use client';

import { createEngineeringTemplate } from '@/modules/c-hub/application/engineering-template/engineering-template-actions';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function EngineeringTemplateForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    if (!name.trim()) {
      setError('模板名稱不能為空');
      setIsSubmitting(false);
      return;
    }

    try {
      await createEngineeringTemplate({
        name,
        description: description || null
      });
      setName('');
      setDescription('');
      setSuccess(true);
      // 失效工程模板快取，觸發重新獲取
      queryClient.invalidateQueries({ queryKey: ['engineeringTemplates'] });
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立工程模板失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="p-2 text-green-600 bg-green-50 rounded border border-green-200 flex justify-between items-center">
          <span>工程模板建立成功!</span>
          <button
            type="button"
            onClick={() => {
              router.refresh();
              setSuccess(false);
            }}
            className="text-blue-600 underline text-sm"
          >
            手動刷新
          </button>
        </div>
      )}

      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="工程模板名稱"
          required
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="描述（可選）"
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? '處理中...' : '建立工程模板'}
      </button>
    </form>
  );
}
