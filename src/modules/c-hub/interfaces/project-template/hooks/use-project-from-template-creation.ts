'use client';

import { createProjectFromTemplate } from '@/modules/c-hub/application/project-instance/project-instance-actions';
import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface ProjectTemplateFormState {
  name: string;
  description: string;
  priority: string;
  startDate: string;
  endDate: string;
}

export function useProjectFromTemplateCreation(template: ProjectTemplate, onCloseAction: () => void) {
  const [formState, setFormState] = useState<ProjectTemplateFormState>({
    name: template.name,
    description: template.description || '',
    priority: '0',
    startDate: '',
    endDate: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFormState({
      name: template.name,
      description: template.description || '',
      priority: '0',
      startDate: '',
      endDate: '',
    });
    setError(null);
    setSuccess(false);
  }, [template]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, name: e.target.value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, description: e.target.value }));
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, priority: e.target.value }));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      startDate: e.target.value,
      endDate: prev.endDate && new Date(e.target.value) > new Date(prev.endDate) ? '' : prev.endDate
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, endDate: e.target.value }));
  };

  const handleCreateFromTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.name.trim()) {
      setError('專案名稱不能為空');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const currentUserId = uuidv4().replace(/-/g, '').substring(0, 24);

      await createProjectFromTemplate(
        template.id,
        {
          name: formState.name,
          description: formState.description || null,
          priority: formState.priority ? parseInt(formState.priority, 10) : 0,
          startDate: formState.startDate ? new Date(formState.startDate) : null,
          endDate: formState.endDate ? new Date(formState.endDate) : null,
          createdBy: currentUserId
        }
      );

      setSuccess(true);
      setTimeout(() => {
        router.push('/client/manage');
        router.refresh();
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : '從模板創建專案失敗');
    } finally {
      setIsCreating(false);
    }
  };

  return {
    formState,
    handleNameChange,
    handleDescriptionChange,
    handlePriorityChange,
    handleStartDateChange,
    handleEndDateChange,
    handleCreateFromTemplate,
    isCreating,
    error,
    success
  };
}
