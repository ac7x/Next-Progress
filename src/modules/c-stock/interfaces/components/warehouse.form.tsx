'use client';

import { useState } from 'react';
import { useCreateWarehouse } from '../hooks';

export function WarehouseInstanceForm() {
  const { mutate, isPending } = useCreateWarehouse();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 簡化表單驗證
    if (!name.trim()) {
      setError('倉庫名稱不能為空');
      return;
    }

    setError(null);
    mutate(
      { name, description: description || null },
      {
        onSuccess: () => {
          // 重設表單並顯示成功訊息
          setName('');
          setDescription('');
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        },
        onError: (err) => setError(err.message)
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 訊息顯示 */}
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

      {/* 表單欄位 */}
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
          disabled={isPending}
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
          disabled={isPending}
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? '建立中...' : '建立倉庫'}
      </button>
    </form>
  );
}
