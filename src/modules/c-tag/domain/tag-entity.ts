import {
  Tag as PrismaTag,
  TagRelationType as PrismaTagRelationType,
  TagType as PrismaTagType
} from '@prisma/client';

// domain 型別
export type Tag = PrismaTag;

// 同時導出值與型別
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