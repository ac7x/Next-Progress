// src/modules/c-tag/interfaces/hooks/useTag.ts
'use client';

import { getTag } from '@/modules/c-tag/application/queries/tag-query-handler';
import { Tag } from '@/modules/c-tag/domain/entities/tag-entity';
import { useQuery } from '@tanstack/react-query';

export function useTag(id: string) {
  return useQuery<Tag | null, Error>({
    queryKey: ['tag', id],
    queryFn: () => getTag(id)
  });
}