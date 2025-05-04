'use client';

import { createWarehouseItem } from '@/modules/c-stock/application/warehouse-item-actions';
import { tagQueryList, tagQueryListByType } from '@/modules/c-tag/application/tag-actions';
import { Tag, TagType } from '@/modules/c-tag/domain/tag-entity';
import { WarehouseItemType } from '@prisma/client'; // 🆕 引入 Prisma 定義的 WarehouseItemType
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface WarehouseItemFormProps {
  warehouseId: string;
  onSuccess?: () => void;
}

export function WarehouseItemForm({ warehouseId, onSuccess }: WarehouseItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [type, setType] = useState<WarehouseItemType>(WarehouseItemType.TOOL); // 🆕 使用正確的 WarehouseItemType
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const itemTags = await tagQueryListByType(TagType.ITEM);
        const generalTags = await tagQueryList();

        const uniqueTags = [...itemTags];
        generalTags.forEach(tag => {
          if (!uniqueTags.some(t => t.id === tag.id)) {
            uniqueTags.push(tag);
          }
        });

        setTags(uniqueTags);
      } catch (err) {
        console.error('載入標籤失敗:', err);
        setError('無法載入標籤資料');
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('物品名稱不能為空');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createWarehouseItem({
        name,
        description: description || null,
        quantity,
        warehouseId,
        type,
        tags: selectedTags.length > 0 ? selectedTags : null
      });

      setName('');
      setDescription('');
      setQuantity(1);
      setSelectedTags([]);

      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立倉庫物品失敗');
      console.error('建立倉庫物品失敗:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          物品名稱
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="物品名稱"
          required
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          描述（選填）
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="描述"
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium mb-1">
          數量
        </label>
        <input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          類型
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as WarehouseItemType)} // 🆕 確保類型正確
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        >
          {Object.values(WarehouseItemType).map((itemType) => (
            <option key={itemType} value={itemType}>
              {itemType}
            </option>
          ))}
        </select>
      </div>

      {tags.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">標籤（選填）</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-2 py-1 text-sm rounded-full transition-colors ${selectedTags.includes(tag.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? '建立中...' : '建立物品'}
      </button>
    </form>
  );
}
