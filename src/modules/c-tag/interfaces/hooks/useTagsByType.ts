import { Tag, TagType } from '@/modules/c-tag/domain/tag-entity';
import { getTags, getTagsByType } from '@/modules/c-tag/interfaces/tag-query-actions';
import { useQuery } from '@tanstack/react-query';

export function useTagsByType(type: TagType | 'ALL') {
    return useQuery<Tag[], Error>({
        queryKey: ['tags', type],
        queryFn: () => type === 'ALL' ? getTags() : getTagsByType(type as TagType),
    });
}
