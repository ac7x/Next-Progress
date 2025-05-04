/**
 * 子任務實體（SubTaskInstance）相關的前端介面層元件與 hooks 匯出入口
 *
 * 功能說明：
 * - 提供 SubTaskInstance（子任務實體）在前端的表單、列表展示與查詢 hook。
 * - 僅負責 UI 呈現與互動，所有業務邏輯皆封裝於領域服務與 Server Actions。
 * - 遵循 DDD 架構，確保前端僅依賴應用層公開的型別與方法。
 *
 * 使用方式：
 * ```tsx
 * import {
 *   SubTaskInstanceForm,
 *   SubTaskInstanceList,
 *   useSubTaskInstancesByTaskInstance,
 *   useSubTaskInstanceUpdate,
 * } from '@/modules/c-hub/interfaces/sub-task-instance';
 * // <SubTaskInstanceForm taskInstanceId={...} />
 * // <SubTaskInstanceList subTaskInstances={...} />
 * // const { data, isLoading } = useSubTaskInstancesByTaskInstance(taskInstanceId);
 * // const { updateSubTaskInstanceField } = useSubTaskInstanceUpdate();
 * ```
 *
 * 擴充建議：
 * - 若需新增其他元件或 hooks，請於對應目錄下實作並於此集中導出。
 */

// 子任務實體相關元件與 hooks
export * from './components/sub-task-instance-details';
export * from './components/sub-task-instance-form';
export * from './components/sub-task-instance-list';
export * from './hooks/use-sub-task-instance';
export * from './hooks/use-sub-task-instance-update';

