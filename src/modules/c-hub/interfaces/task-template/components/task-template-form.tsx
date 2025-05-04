'use client';

import { createTaskTemplate } from '@/modules/c-hub/application/task-template/task-template-actions';
import { EngineeringTemplate } from '@/modules/c-hub/domain/engineering-template/engineering-template-entity';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TaskTemplateFormProps {
  engineeringTemplates: EngineeringTemplate[];
}

export function TaskTemplateForm({ engineeringTemplates }: TaskTemplateFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [engineeringId, setEngineeringId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setSuccess(false);

    try {
      if (!name.trim()) {
        throw new Error('任務名稱不能為空');
      }

      await createTaskTemplate({
        name,
        description: description || null,
        engineeringId: engineeringId || null,
        isActive: true
      });

      setName('');
      setDescription('');
      setEngineeringId('');
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立任務模板失敗');
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
          任務模板建立成功！
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          任務名稱
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="任務名稱"
          required
          disabled={isSubmitting}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          描述（可選）
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="描述（可選）"
          disabled={isSubmitting}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="engineeringId" className="block text-sm font-medium mb-1">
          所屬工程模板（可選）
        </label>
        <select
          id="engineeringId"
          value={engineeringId}
          onChange={(e) => setEngineeringId(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        >
          <option value="">-- 不指定工程模板 --</option>
          {engineeringTemplates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? '處理中...' : '建立任務模板'}
      </button>
    </form>
  );
}

export default TaskTemplateForm;
