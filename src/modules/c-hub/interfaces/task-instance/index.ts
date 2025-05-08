/**
 * 任務實體（TaskInstance）相關的前端介面層元件與 hooks 匯出入口
 *
 * 功能說明：
 * - 提供 TaskInstance（任務實體）在前端的展示、互動與查詢元件。
 * - 僅負責 UI 呈現與互動，所有業務邏輯皆封裝於領域服務與 Server Actions。
 * - 遵循 DDD 架構，確保前端僅依賴應用層公開的型別與方法。
 *
 * 使用方式：
 * ```tsx
 * import {
 *   TaskInstanceDetails,
 *   TaskInstanceSubTaskInstancesSection,
 *   // ...其他元件或 hooks
 * } from '@/modules/c-hub/interfaces/task-instance';
 * // <TaskInstanceDetails taskInstance={...} />
 * // <TaskInstanceSubTaskInstancesSection taskInstanceId={...} />
 * ```
 *
 * 擴充建議：
 * - 若需新增列表、卡片等元件，請於 components/ 目錄下實作並於此集中導出。
 * - 若需新增 hooks，請於 hooks/ 目錄下實作並於此集中導出。
 */

// 匯出主要元件
export * from './components/task-instance-details';
export { default as TaskInstanceSubTaskInstancesSection } from './components/task-instance-sub-task-instances-section';
export * from './components/task-instance-summary-card';

