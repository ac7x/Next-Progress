/**
 * 任務模板（TaskTemplate）相關的前端介面層元件與 hooks 匯出入口
 *
 * 功能說明：
 * - 提供 TaskTemplate（任務模板）在前端的表單、列表展示與查詢 hook。
 * - 僅負責 UI 呈現與互動，所有業務邏輯皆封裝於領域服務與 Server Actions。
 * - 遵循 DDD 架構，確保前端僅依賴應用層公開的型別與方法。
 *
 * 使用方式：
 * ```tsx
 * import {
 *   TaskTemplateForm,
 *   TaskTemplateList,
 *   useTaskTemplatesByEngineering,
 *   useTaskTemplatesByEngineering as useTaskTemplatesByEngineeringAlias,
 * } from '@/modules/c-hub/interfaces/task-template';
 * // <TaskTemplateForm engineeringTemplates={...} />
 * // <TaskTemplateList templates={...} />
 * // const { data, isLoading } = useTaskTemplatesByEngineering(engineeringId);
 * ```
 *
 * 擴充建議：
 * - 若需新增其他元件或 hooks，請於對應目錄下實作並於此集中導出。
 */

// 匯出表單元件
export * from './components/task-template-form';
// 匯出列表元件
export * from './components/task-template-list';
// 明確命名 hooks，避免重複與模稜兩可
export { useTaskTemplatesByEngineering, useTaskTemplatesByEngineering as useTaskTemplatesByEngineeringAlias } from './hooks/use-task-templates-by-engineering';

