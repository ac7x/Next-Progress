'use client';

import { createProjectFromTemplate } from '@/modules/c-hub/application/project-instance/project-instance-actions';
import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/entities/project-template-entity';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface ProjectTemplateFormState {
  name: string;
  description: string;
}

export function useProjectFromTemplateCreation(
  template: ProjectTemplate,
  onCloseAction: () => void,
  currentUserId: string
) {
  const [formState, setFormState] = useState<ProjectTemplateFormState>({
    name: template.name,
    description: template.description || '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFormState({
      name: template.name,
      description: template.description || '',
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

  const handleCreateFromTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.name.trim()) {
      setError('專案名稱不能為空');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await createProjectFromTemplate(
        template.id,
        {
          name: formState.name,
          description: formState.description || null,
          createdBy: currentUserId
        }
      );

      setSuccess(true);
      router.push('/client/instance_management');
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
    handleCreateFromTemplate,
    isCreating,
    error,
    success
  };
}
