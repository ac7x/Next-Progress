import { listProjects } from '@/modules/c-hub/application/project-instance/project-instance-actions';
import { GetProjectTemplateListQueryHandler } from '@/modules/c-hub/application/project-template/project-template.query-handler';
import { ProjectTemplate, isValidProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { EngineeringTemplateForm } from '@/modules/c-hub/interfaces/engineering-template/components/engineering-template-form';
import { EngineeringTemplateList } from '@/modules/c-hub/interfaces/engineering-template/components/engineering-template-list';
import { CreateProjectTemplateForm } from '@/modules/c-hub/interfaces/project-template/components/project-template-create-form';
import { ProjectTemplateList } from '@/modules/c-hub/interfaces/project-template/components/project-template-list';
import { Suspense } from 'react';

export default async function TemplatePage() {
  try {
    // SSR 專案列表
    const projects = await listProjects();

    // SSR 專案模板列表（CQRS Query Handler）
    // 僅呼叫 Application 層的查詢服務，符合 CQRS
    let templatesRaw: unknown;
    try {
      // 確保這裡呼叫的是 Application Query Handler，並且該 Handler 已正確串接 Infrastructure 層
      templatesRaw = await GetProjectTemplateListQueryHandler();
    } catch (err) {
      // 若 Query Handler 失敗，記錄詳細錯誤
      console.error('GetProjectTemplateListQueryHandler error:', err);
      templatesRaw = [];
    }
    // 型別守衛，確保為 ProjectTemplate[]
    const templates: ProjectTemplate[] = Array.isArray(templatesRaw)
      ? templatesRaw.filter(isValidProjectTemplate)
      : [];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* 使用 grid 布局將頁面分為左右兩側 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側：專案模板管理 */}
          <section>
            <h2 className="text-2xl font-bold mb-6">專案模板管理</h2>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">建立新專案模板</h3>
              <CreateProjectTemplateForm />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">現有專案模板</h3>
              {/* SSR 傳遞專案模板資料，Client 端僅負責渲染，不會卡在載入中 */}
              <ProjectTemplateList templates={templates} />
              {templates.length === 0 && (
                <div className="mt-4 p-2 bg-yellow-50 text-yellow-700 rounded border border-yellow-200">
                  尚無可用專案模板，請先建立一個。
                </div>
              )}
            </div>
          </section>

          {/* 右側：工程模板管理 */}
          <section>
            <h2 className="text-2xl font-bold mb-6">工程模板管理</h2>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">建立新工程模板</h3>
              <EngineeringTemplateForm />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">現有工程模板與任務</h3>
              <p className="text-sm text-gray-600 mb-4">
                點擊「生成至專案」可以選擇專案並將工程模板和相關任務直接生成到專案中
              </p>
              <Suspense fallback={<p className="text-gray-500">載入工程模板中...</p>}>
                <EngineeringTemplateList projects={projects} />
              </Suspense>
              {/* 若 projects 為空，EngineeringTemplateList 內部可根據 props 處理 */}
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error) {
    // 捕獲所有 SSR 錯誤，顯示友善訊息
    console.error('模板頁面資料載入失敗', error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <h2 className="font-bold text-xl mb-2">載入失敗</h2>
          <p>無法載入模板資料，請稍後再試</p>
        </div>
      </div>
    );
  }
}