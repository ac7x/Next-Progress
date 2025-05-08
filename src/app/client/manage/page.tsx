import { listProjects } from '@/modules/c-hub/application/project-instance/project-instance-queries';
import { ProjectInstance } from '@/modules/c-hub/domain/project-instance/project-instance-entity';
import { ProjectInstanceList } from '@/modules/c-hub/interfaces/project-instance/components/project-instance-list';
import { Suspense } from 'react';

export default async function ManagePage() {
  try {
    const projects: ProjectInstance[] = await listProjects();

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        <h1 className="text-3xl font-bold mb-6">專案管理</h1>

        <section className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">專案列表</h2>
            {/* 空資料處理 */}
            {projects.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">目前沒有專案，請建立新專案</p>
              </div>
            ) : (
              <Suspense fallback={<p className="text-gray-500">載入專案中...</p>}>
                <ProjectInstanceList projectInstances={projects} />
              </Suspense>
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('專案管理頁面資料載入失敗', error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <h2 className="font-bold text-xl mb-2">載入失敗</h2>
          <p>無法載入專案資料，請稍後再試</p>
        </div>
      </div>
    );
  }
}