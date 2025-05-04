import { z } from 'zod';

// 領域層 enum 定義
export enum TagType {
  GENERAL = 'GENERAL',
  PROJECT_INSTANCE = 'PROJECT_INSTANCE',
  PROJECT_TEMPLATE = 'PROJECT_TEMPLATE',
  ENGINEERING_INSTANCE = 'ENGINEERING_INSTANCE',
  ENGINEERING_TEMPLATE = 'ENGINEERING_TEMPLATE',
  TASK_INSTANCE = 'TASK_INSTANCE',
  TASK_TEMPLATE = 'TASK_TEMPLATE',
  SUBTASK_INSTANCE = 'SUBTASK_INSTANCE',
  SUBTASK_TEMPLATE = 'SUBTASK_TEMPLATE',
  WAREHOUSE_INSTANCE = 'WAREHOUSE_INSTANCE',
  WAREHOUSE_ITEM = 'WAREHOUSE_ITEM',
}

export enum TagRelationType {
  PROJECT_INSTANCE = 'PROJECT_INSTANCE',
  PROJECT_TEMPLATE = 'PROJECT_TEMPLATE',
  ENGINEERING_INSTANCE = 'ENGINEERING_INSTANCE',
  ENGINEERING_TEMPLATE = 'ENGINEERING_TEMPLATE',
  TASK_INSTANCE = 'TASK_INSTANCE',
  TASK_TEMPLATE = 'TASK_TEMPLATE',
  SUBTASK_INSTANCE = 'SUBTASK_INSTANCE',
  SUBTASK_TEMPLATE = 'SUBTASK_TEMPLATE',
  WAREHOUSE_INSTANCE = 'WAREHOUSE_INSTANCE',
  WAREHOUSE_ITEM = 'WAREHOUSE_ITEM',
}

export interface TagRelation {
  id: string;
  tagId: string;
  targetId: string;
  targetType: TagRelationType;
  createdAt: Date;
  priority: number;
}

export interface Tag {
  id: string;
  name: string;
  type: TagType;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTagProps {
  name: string;
  type?: TagType;
  description?: string | null;
  color?: string | null;
}

export interface UpdateTagProps {
  name?: string;
  type?: TagType;
  description?: string | null;
  color?: string | null;
}

// Zod schema for validation
export const createTagSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(TagType).optional(),
  description: z.string().nullable().optional(),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/).nullable().optional(),
  priority: z.number().int().min(0).optional(),
});
export const updateTagSchema = createTagSchema.partial();

export function isValidTag(tag: unknown): tag is Tag {
  return typeof tag === 'object' && tag !== null
    && 'id' in tag && 'name' in tag && 'type' in tag && 'color' in tag;
}