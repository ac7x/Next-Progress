'use client';

import { TagType } from '@/modules/c-tag/domain/tag-entity';
import TagCategoryListClient from '@/modules/c-tag/interfaces/components/tag-category-list';
import TagFormClient from '@/modules/c-tag/interfaces/components/tag-form';
import { TagTypeFilter } from '@/modules/c-tag/interfaces/components/tag-type-filter';
import { getTags, getTagsByType } from '@/modules/c-tag/interfaces/tag-query-actions';
import { useEffect, useState } from 'react';

export default function TagPage() {
  const [selectedType, setSelectedType] = useState<TagType | 'ALL'>('ALL');
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchTags = async () => {
      if (selectedType === 'ALL') {
        setTags(await getTags());
      } else {
        setTags(await getTagsByType(selectedType));
      }
      setLoading(false);
    };
    fetchTags();
  }, [selectedType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-10 text-blue-900 tracking-tight drop-shadow">標籤管理</h1>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">建立標籤</h2>
          <div className="max-w-md">
            <TagFormClient />
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-6 text-blue-800">現有標籤</h2>
          <TagTypeFilter selectedType={selectedType} onChangeAction={setSelectedType} />
          {loading ? (
            <div className="text-gray-500">載入中...</div>
          ) : (
            <TagCategoryListClient tags={tags} />
          )}
        </section>
      </div>
    </div>
  );
}
