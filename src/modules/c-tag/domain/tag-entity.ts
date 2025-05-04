import {
  Tag as PrismaTag,
  TagRelationType as PrismaTagRelationType,
  TagType as PrismaTagType,
} from '@prisma/client';
import { z } from 'zod';

// 域模型 Tag 对应 PrismaTag
export type Tag = PrismaTag;

// 同时导出值与类型
export const TagType = PrismaTagType;
export type TagType = PrismaTagType;

export const TagRelationType = PrismaTagRelationType;
export type TagRelationType = PrismaTagRelationType;

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
  color?: string | null;
  priority?: number;
}

export interface UpdateTagProps {
  name?: string;
  type?: TagType;
  description?: string | null;
  color?: string | null;
  priority?: number;
}

// Zod schema for input validation
export const createTagSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(TagType).optional(),
  description: z.string().nullable().optional(),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/).nullable().optional(),
  priority: z.number().int().min(0).optional(),
});
export const updateTagSchema = createTagSchema.partial();

export function isValidTag(tag: unknown): tag is Tag {
  return typeof tag === 'object' &&
    tag !== null &&
    'id' in tag &&
    'name' in tag &&
    'type' in tag &&
    'createdAt' in tag &&
    'updatedAt' in tag;
}