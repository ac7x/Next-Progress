// src/modules/c-tag/interfaces/index.ts
/**
 * C-Tag Interface Layer
 * 
 * 用法說明：
 * - 建議於 presentation 層（如 page、component）直接 import 本層 hooks/components
 * - hooks 只負責資料取得/快取/觸發 Server Action，無業務邏輯
 * - 元件僅負責 UI 呈現與互動
 * - 請勿於本層寫入任何業務邏輯，所有業務規則應封裝於 domain/application 層
 */

export * from './hooks/useTag';
export * from './hooks/useTagMutations';
export * from './hooks/useTags';
export * from './hooks/useTagsByType';

export * from './components/tag-card';
export * from './components/tag-category-list';
export * from './components/tag-edit-form';
export * from './components/tag-form';
export * from './components/tag-list';
export * from './components/tag-type-filter';

export * from './utils/tag-display-utils';

// 使用範例：
// import { useTags, TagList } from '@/modules/c-tag/interfaces';
// const { data } = useTags();
// <TagList tags={data ?? []} />