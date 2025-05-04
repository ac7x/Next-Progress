import { listProjects } from '@/modules/c-hub/application/project-instance/project-instance-actions';
import { ProjectInstance } from '@/modules/c-hub/domain/project-instance/project-instance-entity';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function DashboardPage() {
  try {
    // 只載入專案資料
    const projects: ProjectInstance[] = await listProjects();

    return (
      <div className="p-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">專案管理儀表板</h1>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">專案概覽</h2>
            {projects.length > 3 && (
              <Link href="/client/manage" className="text-blue-500 hover:underline text-sm">
                查看全部專案 ({projects.length})
              </Link>
            )}
          </div>

          {/* 空資料處理 */}
          {projects.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-3">目前沒有專案</p>
              <Link href="/client/project/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                建立新專案
              </Link>
            </div>
          ) : (
            <Suspense fallback={<p className="text-gray-500">載入專案中...</p>}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="border p-4 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
                    <h3 className="font-medium">{project.name}</h3>
                    {project.description && <p className="text-sm text-gray-600 mt-1">{project.description}</p>}
                    <div className="mt-2 text-xs text-gray-500">
                      <p>建立時間: {new Date(project.createdAt).toLocaleDateString()}</p>
                      {project.startDate && <p>開始日期: {new Date(project.startDate).toLocaleDateString()}</p>}
                      {project.endDate && <p>結束日期: {new Date(project.endDate).toLocaleDateString()}</p>}
                    </div>
                    <div className="mt-3 text-right">
                      <Link href={`/client/project/${project.id}`} className="text-blue-500 hover:underline text-sm">
                        查看詳情
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Suspense>
          )}
        </section>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <h2 className="font-bold text-xl mb-2">載入失敗</h2>
          <p>無法載入儀表板資料，請稍後再試</p>
        </div>
      </div>
    );
  }
}