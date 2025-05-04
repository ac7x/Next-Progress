import { getTagById } from '@/modules/c-tag/application/tag-actions';
import { Tag } from '@/modules/c-tag/domain/tag-entity';
import { useQuery } from '@tanstack/react-query';

export function useTag(id: string) {
  return useQuery<Tag | null, Error>({
    queryKey: ['tag', id],
    queryFn: () => getTagById(id)
  });
}
