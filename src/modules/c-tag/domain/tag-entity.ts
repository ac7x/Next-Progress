import { Tag as PrismaTag, TagType as PrismaTagType } from '@prisma/client';

export { PrismaTagType };

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

export interface Tag extends PrismaTag { }

export interface TagRelation {
  id: string;
  tagId: string;
  targetId: string;
  targetType: TagRelationType;
  createdAt: Date;
  priority: number;
}

export interface CreateTagProps {
  name: string;
  type?: TagType;
  description?: string | null;
}

export interface UpdateTagProps {
  name?: string;
  type?: TagType;
  description?: string | null;
}

export function isValidTag(tag: unknown): tag is Tag {
  return typeof tag === 'object' &&
    tag !== null &&
    'id' in tag &&
    'name' in tag &&
    'type' in tag &&
    'createdAt' in tag &&
    'updatedAt' in tag;
}