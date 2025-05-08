import { listProjects } from '@/modules/c-hub/application/project-instance/project-instance-queries';
import { GetProjectTemplateListQueryHandler } from '@/modules/c-hub/application/project-template/project-template.query-handler';
import { ProjectTemplate, isValidProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { EngineeringTemplateForm } from '@/modules/c-hub/interfaces/engineering-template/components/engineering-template-form';
import { EngineeringTemplateList } from '@/modules/c-hub/interfaces/engineering-template/components/engineering-template-list';
import { CreateProjectTemplateForm } from '@/modules/c-hub/interfaces/project-template/components/project-template-create-form';
import { ProjectTemplateList } from '@/modules/c-hub/interfaces/project-template/components/project-template-list';
import { Suspense } from 'react';

// Application Query Handlers
import { listSubTaskTemplatesByTaskTemplateId } from '@/modules/c-hub/application/sub-task-template/sub-task-template-actions';
import { listTaskTemplatesQuery } from '@/modules/c-hub/application/task-template/task-template.query';
import { getEngineeringTemplateListHandler } from '@/modules/c-hub/interfaces/engineering-template/server-actions/get-engineering-template-list-handler';

export default async function TemplatePage() {
  try {
    // 1. SSR 查詢所有專案（ProjectInstance）
    // 2. SSR 查詢所有專案模板（ProjectTemplate）
    // 3. SSR 查詢所有工程模板
    // 4. SSR 查詢所有任務模板
    // 5. SSR 查詢所有子任務模板（依任務模板分組）
    const projects = await listProjects();

    // 2. SSR 查詢所有專案模板（ProjectTemplate）
    let templatesRaw: unknown;
    try {
      templatesRaw = await GetProjectTemplateListQueryHandler();
    } catch (err) {
      console.error('GetProjectTemplateListQueryHandler error:', err);
      templatesRaw = [];
    }
    const projectTemplates: ProjectTemplate[] = Array.isArray(templatesRaw)
      ? templatesRaw.filter(isValidProjectTemplate)
      : [];

    // 3. SSR 查詢所有工程模板
    const engineeringTemplates = await getEngineeringTemplateListHandler();

    // 4. SSR 查詢所有任務模板
    const taskTemplates = await listTaskTemplatesQuery();

    // 5. SSR 查詢所有子任務模板（依任務模板分組）
    const subTaskTemplatesMap: Record<string, Awaited<ReturnType<typeof listSubTaskTemplatesByTaskTemplateId>>> = {};
    for (const task of taskTemplates) {
      subTaskTemplatesMap[task.id] = await listSubTaskTemplatesByTaskTemplateId(task.id);
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* 一致性區塊：專案模板 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">專案模板管理</h2>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">建立新專案模板</h3>
            <CreateProjectTemplateForm />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">現有專案模板</h3>
            <ProjectTemplateList templates={projectTemplates} />
          </div>
        </section>

        {/* 一致性區塊：工程模板 */}
        <section className="mb-16">
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
          </div>
        </section>

        {/* 一致性區塊：任務模板 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">任務模板管理</h2>
          {engineeringTemplates.length === 0 ? (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded mb-6">
              尚無工程模板，請先建立工程模板以管理任務模板。
            </div>
          ) : (
            engineeringTemplates.map((et) => {
              const tasks = taskTemplates.filter(t => t.engineeringId === et.id);
              return (
                <div key={et.id} className="mb-8 border rounded-lg bg-white shadow-sm p-4">
                  <h3 className="text-xl font-semibold mb-2">{et.name}</h3>
                  <div className="text-gray-500 text-sm mb-2">{et.description}</div>
                  {tasks.length === 0 ? (
                    <div className="text-gray-400 text-sm">尚無任務模板</div>
                  ) : (
                    <ul className="space-y-2">
                      {tasks.map(task => (
                        <li key={task.id} className="p-2 border rounded bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{task.name}</span>
                              {task.description && (
                                <span className="ml-2 text-xs text-gray-500">{task.description}</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">優先級: {task.priority}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </section>

        {/* 一致性區塊：子任務模板 */}
        <section>
          <h2 className="text-2xl font-bold mb-6">子任務模板管理</h2>
          {taskTemplates.length === 0 ? (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded mb-6">
              尚無任務模板，請先建立任務模板以管理子任務模板。
            </div>
          ) : (
            taskTemplates.map((task) => {
              const subTaskTemplates = subTaskTemplatesMap[task.id] || [];
              return (
                <div key={task.id} className="mb-8 border rounded-lg bg-white shadow-sm p-4">
                  <h3 className="text-lg font-semibold mb-2">{task.name}</h3>
                  <div className="text-gray-500 text-sm mb-2">{task.description}</div>
                  {subTaskTemplates.length === 0 ? (
                    <div className="text-gray-400 text-sm">尚無子任務模板</div>
                  ) : (
                    <ul className="space-y-2">
                      {subTaskTemplates.map(sub => (
                        <li key={sub.id} className="p-2 border rounded bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{sub.name}</span>
                              {sub.description && (
                                <span className="ml-2 text-xs text-gray-500">{sub.description}</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">優先級: {sub.priority}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </section>
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