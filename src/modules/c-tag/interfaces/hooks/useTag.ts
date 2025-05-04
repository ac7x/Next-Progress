import { Tag } from '@/modules/c-tag/domain/tag-entity';
import { getTag } from '@/modules/c-tag/interfaces/tag-query-actions';
import { useQuery } from '@tanstack/react-query';

export function useTag(id: string) {
  return useQuery<Tag | null, Error>({
    queryKey: ['tag', id],
    queryFn: () => getTag(id)
  });
}
