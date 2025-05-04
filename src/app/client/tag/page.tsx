'use client';

import { TagCategoryList } from '@/modules/c-tag/interfaces/components/tag-category-list';
import { TagForm } from '@/modules/c-tag/interfaces/components/tag-form';
import { useTags } from '@/modules/c-tag/interfaces/hooks/useTags';

export default function TagPage() {
  const { data: tags = [], isLoading, error } = useTags();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">標籤管理</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">建立標籤</h2>
        <div className="max-w-md">
          <TagForm />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">現有標籤</h2>
        {isLoading ? (
          <p className="text-gray-500">載入標籤中...</p>
        ) : error ? (
          <p className="text-red-500">{String(error)}</p>
        ) : (
          <TagCategoryList tags={tags} />
        )}
      </section>
    </div>
  );
}
