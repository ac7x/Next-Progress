'use client';

import { createEngineeringFromTemplate } from '@/modules/c-hub/application/engineering-instance/engineering-instance-actions';
import { listTaskTemplatesByEngineeringId } from '@/modules/c-hub/application/task-template/task-template-actions';
import { EngineeringTemplate } from '@/modules/c-hub/domain/engineering-template/engineering-template-entity';
import { ProjectInstance } from '@/modules/c-hub/domain/project-instance/project-instance-entity';
import { TaskTemplate } from '@/modules/c-hub/domain/task-template/task-template-entity';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface EngineeringTemplateInsertButtonProps {
  template: EngineeringTemplate;
  projects: ProjectInstance[];
  project?: ProjectInstance;
  onSuccess?: () => void;
  className?: string;
}

export function EngineeringTemplateInsertButton({
  template,
  projects,
  project,
  onSuccess,
  className = ''
}: EngineeringTemplateInsertButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(project?.id || '');
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([]);
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});
  const router = useRouter();

  // 載入任務模板
  useEffect(() => {
    if (isModalOpen) {
      listTaskTemplatesByEngineeringId(template.id).then((tasks) => {
        setTaskTemplates(tasks);
        // 預設每個任務數量為 1
        const defaultCounts: Record<string, number> = {};
        tasks.forEach(t => { defaultCounts[t.id] = 1; });
        setTaskCounts(defaultCounts);
      });
    }
  }, [isModalOpen, template.id]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setName(template.name);
    setDescription(template.description || '');
    if (project) {
      setSelectedProjectId(project.id);
    }
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 處理任務數量變更
  const handleTaskCountChange = (taskId: string, value: number) => {
    setTaskCounts(prev => ({
      ...prev,
      [taskId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!name.trim()) {
      setError('工程名稱不能為空');
      setIsSubmitting(false);
      return;
    }

    if (!selectedProjectId) {
      setError('請選擇一個專案');
      setIsSubmitting(false);
      return;
    }

    // 準備任務數量資料
    const tasksWithCount = taskTemplates
      .map(t => ({
        taskTemplateId: t.id,
        count: Number(taskCounts[t.id]) || 0
      }))
      .filter(t => t.count > 0);

    try {
      await createEngineeringFromTemplate({
        engineeringTemplateId: template.id,
        projectId: selectedProjectId,
        name,
        description: description || null,
        // 傳遞任務數量資訊
        tasks: tasksWithCount
      } as any); // 若型別不符，請同步調整 application/domain 層型別

      setIsModalOpen(false);

      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '插入工程模板失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`${className || 'px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm'}`}
      >
        生成至專案
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">將工程模板生成至專案</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-2 text-red-600 bg-red-50 rounded border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">選擇專案</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">-- 請選擇專案 --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  工程名稱
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  描述 (選填)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={3}
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {/* 新增：任務模板數量設定，超過 5 個時出現滾動條 */}
              {taskTemplates.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1">任務數量設定</label>
                  <div
                    className="space-y-2"
                    style={{
                      maxHeight: '220px', // 約可容納 5-6 行
                      overflowY: taskTemplates.length > 5 ? 'auto' : 'visible'
                    }}
                  >
                    {taskTemplates.map(task => (
                      <div key={task.id} className="flex items-center gap-2">
                        <span className="flex-1 text-sm">{task.name}</span>
                        <input
                          type="number"
                          min={1}
                          value={taskCounts[task.id] ?? 1}
                          onChange={e => handleTaskCountChange(task.id, Number(e.target.value))}
                          className="w-20 p-1 border rounded"
                          disabled={isSubmitting}
                        />
                        <span className="text-xs text-gray-500">個</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '處理中...' : '生成工程與任務'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
