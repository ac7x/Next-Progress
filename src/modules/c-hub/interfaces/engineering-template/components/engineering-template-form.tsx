'use client';

import { createEngineeringTemplate } from '@/modules/c-hub/application/engineering-template/engineering-template-command';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function EngineeringTemplateForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // 成功建立後自動刷新頁面
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.refresh();
        setSuccess(false);
      }, 1500); // 1.5秒後自動刷新，讓用戶能看到成功訊息

      return () => clearTimeout(timer);
    }
  }, [success, router]);

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
        description: description || null,
        priority
      });
      setName('');
      setDescription('');
      setPriority(0);
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
        <div className="p-2 text-green-600 bg-green-50 rounded border border-green-200">
          <span>工程模板建立成功! 頁面將自動更新...</span>
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
      <div>
        <input
          type="number"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          placeholder="優先順序（數字，越小越高）"
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
          min={0}
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
