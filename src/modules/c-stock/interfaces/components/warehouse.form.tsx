'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useCreateWarehouseInstance } from '../hooks/useWarehouseMutations';

export function WarehouseInstanceForm() {
  const qc = useQueryClient();
  const { mutate, isPending, error: mutateError, isError, isSuccess } = useCreateWarehouseInstance();
  const submitting = isPending;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('倉庫名稱不能為空');
      return;
    }
    setError(null);
    mutate(
      { name, description: description || null },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['warehouseInstances'] });
          setName('');
          setDescription('');
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        },
        onError(err) {
          setError(err.message);
        }
      }
    );
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
          倉庫建立成功！
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          倉庫名稱
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="輸入倉庫名稱"
          className="w-full p-2 border rounded"
          disabled={submitting}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          描述（選填）
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="輸入倉庫描述"
          className="w-full p-2 border rounded"
          rows={3}
          disabled={submitting}
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={submitting}
      >
        {submitting ? '建立中...' : '建立倉庫'}
      </button>
    </form>
  );
}
