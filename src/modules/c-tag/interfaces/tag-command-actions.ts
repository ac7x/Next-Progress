// src/modules/c-tag/interfaces/tag-command-actions.ts
'use server';

import { CreateTagCommandHandler, DeleteTagCommandHandler, UpdateTagCommandHandler } from '../application/commands/tag-command-handler';
import { CreateTagProps, UpdateTagProps } from '../domain/entities/tag-entity';

// Command Server Actions - 介面層僅負責轉發請求到應用層的命令處理器
export async function createTagAction(data: CreateTagProps) {
    return CreateTagCommandHandler(data);
}

export async function updateTagAction(id: string, data: UpdateTagProps) {
    return UpdateTagCommandHandler(id, data);
}

export async function deleteTagAction(id: string) {
    return DeleteTagCommandHandler(id);
}