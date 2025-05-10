// src/modules/c-tag/interfaces/hooks/useTags.ts
'use client';

import { getTags } from '@/modules/c-tag/application/queries/tag-query-handler';
import { Tag } from '@/modules/c-tag/domain/entities/tag-entity';
import { useQuery } from '@tanstack/react-query';

// 只負責資料取得與快取，錯誤/loading 狀態交由 UI 處理
export function useTags() {
  return useQuery<Tag[], Error>({
    queryKey: ['tags'],
    queryFn: getTags,
  });
}