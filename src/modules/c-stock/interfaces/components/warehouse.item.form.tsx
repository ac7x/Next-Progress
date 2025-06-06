'use client';

import { WarehouseItemTypeEnum } from '@/modules/c-stock/domain';
import { useCreateWarehouseItem } from '@/modules/c-stock/interfaces/hooks';
import { getTags, getTagsByType } from '@/modules/c-tag/application/queries/tag-query-handler';
import { Tag, TagType } from '@/modules/c-tag/domain/entities/tag-entity';
import { useEffect, useState } from 'react';

interface WarehouseItemFormProps {
  warehouseId: string;
  onSuccess?: () => void;
}

export function WarehouseItemForm({ warehouseId, onSuccess }: WarehouseItemFormProps) {
  // 表單狀態
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [type, setType] = useState<string>(WarehouseItemTypeEnum.TOOL);

  // 使用 hook
  const { mutate, isPending } = useCreateWarehouseItem();

  // 載入標籤資料
  useEffect(() => {
    const loadTags = async () => {
      try {
        const [itemTags, generalTags] = await Promise.all([
          getTagsByType(TagType.WAREHOUSE_ITEM),
          getTags()
        ]);

        // 合併並去除重複標籤
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

    loadTags();
  }, []);

  // 提交表單處理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('物品名稱不能為空');
      return;
    }

    setError(null);

    mutate(
      {
        name,
        description: description || null,
        quantity,
        warehouseId,
        type,
        tags: selectedTags.length > 0 ? selectedTags : null
      },
      {
        onSuccess: () => {
          // 重置表單
          setName('');
          setDescription('');
          setQuantity(1);
          setSelectedTags([]);
          onSuccess?.();
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : '建立倉庫物品失敗');
        }
      }
    );
  };

  // 切換標籤選擇
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 錯誤提示 */}
      {error && (
        <div className="p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* 表單欄位 */}
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
          disabled={isPending}
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
          disabled={isPending}
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
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-full p-2 border rounded"
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          類型
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={isPending}
        >
          {Object.values(WarehouseItemTypeEnum).map((itemType) => (
            <option key={itemType} value={itemType}>
              {itemType === WarehouseItemTypeEnum.TOOL ? '工具' :
                itemType === WarehouseItemTypeEnum.EQUIPMENT ? '設備' :
                  itemType === WarehouseItemTypeEnum.CONSUMABLE ? '耗材' : itemType}
            </option>
          ))}
        </select>
      </div>

      {/* 標籤選擇 */}
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
        disabled={isPending}
      >
        {isPending ? '建立中...' : '建立物品'}
      </button>
    </form>
  );
}
