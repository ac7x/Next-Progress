import { Tag, UpdateTagProps } from '@/modules/c-tag/domain/tag-entity';
import { createTagAction, deleteTagAction, updateTagAction } from '@/modules/c-tag/interfaces/tag-command-actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['tag', 'create'],
    mutationFn: createTagAction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tags'] });
    }
  });
}

export function useUpdateTag() {
  const qc = useQueryClient();
  return useMutation<Tag, Error, { id: string; data: UpdateTagProps }>({
    mutationKey: ['tag', 'update'],
    mutationFn: ({ id, data }) => updateTagAction(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['tags'] });
      qc.invalidateQueries({ queryKey: ['tag', id] });
    }
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationKey: ['tag', 'delete'],
    mutationFn: deleteTagAction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tags'] });
    }
  });
}
