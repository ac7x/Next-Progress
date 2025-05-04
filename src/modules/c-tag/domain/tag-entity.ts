import { Tag as PrismaTag, TagType } from '@prisma/client';

export { TagType };

export interface Tag extends PrismaTag {}

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