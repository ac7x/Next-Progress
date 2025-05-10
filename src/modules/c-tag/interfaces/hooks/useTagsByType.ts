// src/modules/c-tag/interfaces/hooks/useTagsByType.ts
'use client';

import { getTags, getTagsByType } from '@/modules/c-tag/application/queries/tag-query-handler';
import { Tag, TagType } from '@/modules/c-tag/domain/entities/tag-entity';
import { useQuery } from '@tanstack/react-query';

export function useTagsByType(type: TagType | 'ALL') {
    return useQuery<Tag[], Error>({
        queryKey: ['tags', type],
        queryFn: () => type === 'ALL' ? getTags() : getTagsByType(type as TagType),
    });
}