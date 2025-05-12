'use client';

import { WarehouseItem } from '@/modules/c-stock/domain';
import { useDeleteWarehouseItem, useWarehouseItemTagMutations } from '@/modules/c-stock/interfaces/hooks';
import { getTagsByType } from '@/modules/c-tag/application/queries/tag-query-handler';
import { Tag, TagType } from '@/modules/c-tag/domain/entities/tag-entity';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface WarehouseItemListProps {
  items: WarehouseItem[];
  onDelete?: () => void;
}

export function WarehouseItemList({ items, onDelete }: WarehouseItemListProps) {
  const [isAddingTag, setIsAddingTag] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const router = useRouter();
  const { addTag, removeTag } = useWarehouseItemTagMutations();

  useEffect(() => {
    async function fetchTags() {
      try {
        const tags = await getTagsByType(TagType.WAREHOUSE_ITEM);
        setAvailableTags(tags);
      } catch (err) {
        console.error('載入標籤失敗:', err);
      }
    }
    fetchTags();
  }, []);

  const handleAddTag = async (itemId: string) => {
    const tagId = prompt('請選擇標籤 ID:');
    if (!tagId) return;

    setIsAddingTag(itemId);
    setError(null);

    addTag.mutate(
      { itemId, tagId },
      {
        onSuccess: () => {
          router.refresh();
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : '新增標籤失敗');
          console.error('新增標籤失敗:', err);
        },
        onSettled: () => {
          setIsAddingTag(null);
        }
      }
    );
  };

  const handleRemoveTag = async (itemId: string, tagId: string) => {
    setError(null);

    removeTag.mutate(
      { itemId, tagId },
      {
        onSuccess: () => {
          router.refresh();
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : '移除標籤失敗');
          console.error('移除標籤失敗:', err);
        }
      }
    );
  };

  const { mutate: deleteMutate, isPending: isDeletePending } = useDeleteWarehouseItem();

  const handleDelete = (id: string) => {
    if (!confirm('確定要刪除此物品嗎？')) {
      return;
    }

    setIsDeleting(id);
    setError(null);

    deleteMutate(id, {
      onSuccess: () => {
        if (onDelete) {
          onDelete();
        }
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : '刪除物品失敗');
        console.error('刪除物品失敗:', err);
      },
      onSettled: () => {
        setIsDeleting(null);
      }
    });
  };

  if (items.length === 0) {
    return <p className="text-gray-500">此倉庫目前沒有物品</p>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">物品名稱</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">數量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">標籤</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4">{item.description || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4">
                  {item.tags && item.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span key={tag.id} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag.name}
                          <button
                            onClick={() => handleRemoveTag(item.id, tag.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : '—'}
                  <button
                    onClick={() => handleAddTag(item.id)}
                    disabled={isAddingTag === item.id}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    {isAddingTag === item.id ? '新增中...' : '+'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting === item.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {isDeleting === item.id ? '刪除中...' : '刪除'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
