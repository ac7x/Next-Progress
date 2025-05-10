// src/modules/c-tag/interfaces/tag-command-actions.ts
'use server';

import { TagCommandService } from '@/modules/c-tag/application/commands/tag-commands';
import { CreateTagProps, UpdateTagProps } from '@/modules/c-tag/domain/entities/tag-entity';
import { TagDomainService } from '@/modules/c-tag/domain/services/tag-domain-service';
import { tagRepository } from '@/modules/c-tag/infrastructure/repositories/tag-repository';
import { revalidatePath } from 'next/cache';

// 初始化服務
const domainService = new TagDomainService(tagRepository);
const commandService = new TagCommandService(domainService);

// Command Server Actions
export async function createTagAction(data: CreateTagProps) {
    const tag = await commandService.createTag(data);
    revalidatePath('/client/dashboard');
    revalidatePath('/client/tag');
    return tag;
}

export async function updateTagAction(id: string, data: UpdateTagProps) {
    const tag = await commandService.updateTag(id, data);
    revalidatePath('/client/dashboard');
    revalidatePath('/client/tag');
    return tag;
}

export async function deleteTagAction(id: string) {
    await commandService.deleteTag(id);
    revalidatePath('/client/dashboard');
    revalidatePath('/client/tag');
}