import { createTag, deleteTag, updateTag } from '@/modules/c-tag/application/tag-actions';
import { Tag, UpdateTagProps } from '@/modules/c-tag/domain/tag-entity';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['tag', 'create'],
    mutationFn: createTag,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tags'] });
    }
  });
}

export function useUpdateTag() {
  const qc = useQueryClient();
  return useMutation<Tag, Error, { id: string; data: UpdateTagProps }>({
    mutationKey: ['tag', 'update'],
    mutationFn: ({ id, data }) => updateTag(id, data),
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
    mutationFn: deleteTag,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tags'] });
    }
  });
}
