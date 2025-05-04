import { getTags } from '@/modules/c-tag/interfaces/actions';
import TagCategoryListClient from '@/modules/c-tag/interfaces/components/tag-category-list';
import TagFormClient from '@/modules/c-tag/interfaces/components/tag-form';

export default async function TagPage() {
  const tags = await getTags();
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">標籤管理</h1>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">建立標籤</h2>
        <div className="max-w-md">
          <TagFormClient />
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-6">現有標籤</h2>
        <TagCategoryListClient tags={tags} />
      </section>
    </div>
  );
}
