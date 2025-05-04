'use server';
import { CreateTagProps, createTagSchema } from '@/modules/c-tag/domain/tag-entity';
import { revalidatePath } from 'next/cache';
import { tagService } from './tag-service';

export async function createTagCommand(input: unknown): Promise<CreateTagProps> {
    const data = createTagSchema.parse(input);
    const tag = await tagService.createTag(data);
    revalidatePath('/client/tag');
    return tag;
}
