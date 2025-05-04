'use server';

import { tagCommandService } from '@/modules/c-tag/application/tag-command';
import { CreateTagProps, UpdateTagProps } from '@/modules/c-tag/domain/tag-entity';
import { revalidatePath } from 'next/cache';

export async function createTagAction(data: CreateTagProps) {
    const tag = await tagCommandService.createTag(data);
    revalidatePath('/client/dashboard');
    revalidatePath('/client/tag');
    return tag;
}

export async function updateTagAction(id: string, data: UpdateTagProps) {
    const tag = await tagCommandService.updateTag(id, data);
    revalidatePath('/client/dashboard');
    revalidatePath('/client/tag');
    return tag;
}

export async function deleteTagAction(id: string) {
    await tagCommandService.deleteTag(id);
    revalidatePath('/client/dashboard');
    revalidatePath('/client/tag');
}
