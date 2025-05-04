'use client';

import { createProject, createProjectFromTemplate } from '@/modules/c-hub/application/project-instance/project-instance-actions';
import { listProjectTemplates } from '@/modules/c-hub/application/project-template/project-template-actions';
import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface ProjectFormState {
  name: string;
  description: string;
  templateId: string;
  priority: string; // 添加 priority 欄位，表單中使用字串型態
  startDate: string;
  endDate: string;
}

export function useProjectCreation() {
  const [formState, setFormState] = useState<ProjectFormState>({
    name: '',
    description: '',
    templateId: '',
    priority: '0', // 預設為 "0"
    startDate: '',
    endDate: '',
  });

  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // 載入模板數據
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await listProjectTemplates();
        setTemplates(data);
      } catch (err) {
        console.error('Failed to load templates:', err);
      }
    };
    fetchTemplates();
  }, []);

  // 通用的輸入處理函數
  const handleInputChange = (field: keyof ProjectFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState(prev => ({
      ...prev,
      templateId: e.target.value
    }));
  };

  // 處理優先順序變更
  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      priority: e.target.value
    }));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      startDate: e.target.value,
      // 如果新的開始日期晚於結束日期，清空結束日期
      endDate: prev.endDate && new Date(e.target.value) > new Date(prev.endDate) ? '' : prev.endDate
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      endDate: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.name.trim()) {
      setError('專案名稱不能為空');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 使用 UUID 生成符合 MongoDB ObjectID 格式的 ID (24位十六進制字串)
      const currentUserId = uuidv4().replace(/-/g, '').substring(0, 24);

      // 基本專案數據
      const projectData = {
        name: formState.name,
        description: formState.description || null,
        priority: formState.priority ? parseInt(formState.priority, 10) : 0, // 轉換為數字
        startDate: formState.startDate ? new Date(formState.startDate) : null,
        endDate: formState.endDate ? new Date(formState.endDate) : null,
        createdBy: currentUserId
      };

      // 根據是否選擇了模板來決定創建方式
      if (formState.templateId) {
        await createProjectFromTemplate(formState.templateId, projectData);
      } else {
        await createProject(projectData);
      }

      // 顯示成功消息
      setSuccess(true);

      // 重置表單
      setFormState({
        name: '',
        description: '',
        templateId: '',
        priority: '0', // 預設為 "0"
        startDate: '',
        endDate: ''
      });

      // 1.5秒後刷新頁面並前往專案管理頁
      setTimeout(() => {
        router.refresh();
        router.push('/client/manage');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '創建專案失敗');
      console.error('Failed to create project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formState,
    handleInputChange,
    handleTemplateChange,
    handlePriorityChange, // 添加 handlePriorityChange
    handleStartDateChange,
    handleEndDateChange,
    handleSubmit,
    templates,
    isLoading,
    error,
    success
  };
}
