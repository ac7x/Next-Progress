# 專案管理系統
┌───────────────────────────┐
│        Interfaces         │  <- 對外介面層（API、UI、CLI）
└───────────────────────────┘
           ↓
┌───────────────────────────┐
│       Application         │  <- 應用層（用例、流程協調）
└───────────────────────────┘
           ↓
┌───────────────────────────┐
│         Domain            │  <- 核心業務邏輯（實體、值物件、聚合）
└───────────────────────────┘
           ↓
┌───────────────────────────┐
│      Infrastructure       │  <- 基礎設施（DB、API、第三方服務）
└───────────────────────────┘
## 文件樹結構
```
src/
├── application/
│   └── projectmanager/
│       ├── engineering/
│       │   ├── create-engineering.ts           # 建立工程
│       │   ├── update-engineering.ts           # 更新工程資訊
│       │   ├── delete-engineering.ts           # 刪除工程
│       │   ├── insert-engineering.ts           # 插入工程到特定專案
│       │   ├── list-engineering-for-dashboard.ts # 儀表板獲取工程列表
│       │   ├── get-engineering-details.ts      # 獲取工程詳細資料（包含進度百分比）
│       │   ├── calculate-engineering-metrics.ts # 儀表板計算工程數據
│       │   ├── engineering-actions.ts          # 工程操作邏輯
│       │   ├── engineering-services.ts         # 工程共享服務
│       │   ├── hooks/
│       │   │   ├── useEngineeringList.ts       # 獲取工程列表的 Hook
│       │   │   ├── useEngineeringDetails.ts    # 獲取工程詳細資料的 Hook
│       │   │   ├── useCreateEngineering.ts     # 建立工程的 Hook
│       │   │   └── useUpdateEngineering.ts     # 更新工程的 Hook
│       ├── engineering-template/
│       │   ├── create-engineering-template.ts  # 建立工程模板
│       │   ├── update-engineering-template.ts  # 更新工程模板
│       │   ├── delete-engineering-template.ts  # 刪除工程模板
│       │   ├── list-engineering-templates.ts   # 獲取所有工程模板列表
│       │   ├── engineering-template-actions.ts # 工程模板操作邏輯
│       │   ├── engineering-template-services.ts # 工程模板共享服務
│       │   ├── hooks/
│       │   │   ├── useEngineeringTemplateList.ts # 獲取工程模板列表的 Hook
│       │   │   ├── useCreateEngineeringTemplate.ts # 建立工程模板的 Hook
│       │   │   └── useUpdateEngineeringTemplate.ts # 更新工程模板的 Hook
│       ├── project/
│       │   ├── create-project.ts               # 建立專案（含保險設定）
│       │   ├── update-project.ts               # 更新專案資訊
│       │   ├── delete-project.ts               # 刪除專案
│       │   ├── insert-engineering-to-project.ts # 在專案內插入工程
│       │   ├── list-projects.ts                # 列出所有專案
│       │   ├── manage-project-insurance.ts     # 設置專案保險（激活或修改保險資訊）
│       │   ├── get-project-details.ts          # 獲取專案詳細資料（包含進度百分比）
│       │   ├── calculate-project-metrics.ts    # 儀表板計算專案數據
│       │   ├── project-actions.ts              # 專案操作邏輯
│       │   ├── project-services.ts             # 專案共享服務
│       │   ├── hooks/
│       │   │   ├── useProjectList.ts           # 獲取專案列表的 Hook
│       │   │   ├── useProjectDetails.ts        # 獲取專案詳細資料的 Hook
│       │   │   ├── useCreateProject.ts         # 建立專案的 Hook
│       │   │   └── useUpdateProject.ts         # 更新專案的 Hook
│       ├── task/
│       │   ├── create-task.ts                  # 建立任務
│       │   ├── update-task.ts                  # 更新任務資訊
│       │   ├── delete-task.ts                  # 刪除任務
│       │   ├── insert-subtask-to-task.ts       # 插入子任務到任務
│       │   ├── list-tasks.ts                   # 列出所有任務
│       │   ├── get-task-details.ts             # 獲取任務詳細資料（包含進度百分比）
│       │   ├── calculate-task-metrics.ts       # 儀表板計算任務數據
│       │   ├── task-actions.ts                 # 任務操作邏輯
│       │   ├── manage-task-dependencies.ts     # 管理任務依賴
│       │   ├── task-services.ts                # 任務共享服務
│       │   ├── hooks/
│       │   │   ├── useTaskList.ts              # 獲取任務列表的 Hook
│       │   │   ├── useTaskDetails.ts           # 獲取任務詳細資料的 Hook
│       │   │   ├── useCreateTask.ts            # 建立任務的 Hook
│       │   │   └── useManageTaskDependencies.ts # 管理任務依賴的 Hook
│       ├── notification/
│       │   ├── create-notification.ts          # 建立通知
│       │   ├── list-notifications.ts           # 列出所有通知
│       │   ├── notification-actions.ts         # 通知操作邏輯
│       │   ├── notification-services.ts        # 通知共享服務
│       │   ├── manage-notification-settings.ts # 管理通知設定
│       │   ├── hooks/
│       │   │   ├── useNotificationList.ts      # 獲取通知列表的 Hook
│       │   │   ├── useCreateNotification.ts    # 建立通知的 Hook
│       │   │   └── useNotificationSettings.ts  # 管理通知設定的 Hook
│       ├── attachment/
│       │   ├── upload-attachment.ts            # 上傳附件
│       │   ├── list-attachments.ts             # 列出附件
│       │   ├── delete-attachment.ts            # 刪除附件
│       │   ├── attachment-actions.ts           # 附件操作邏輯
│       │   ├── attachment-services.ts          # 附件共享服務
│       │   ├── hooks/
│       │   │   ├── useAttachmentList.ts        # 獲取附件列表的 Hook
│       │   │   ├── useUploadAttachment.ts      # 上傳附件的 Hook
│       │   │   └── useDeleteAttachment.ts      # 刪除附件的 Hook
│       ├── tag/
│       │   ├── create-tag.ts                   # 建立標籤
│       │   ├── list-tags.ts                    # 列出標籤
│       │   ├── delete-tag.ts                   # 刪除標籤
│       │   ├── tag-actions.ts                  # 標籤操作邏輯
│       │   ├── tag-services.ts                 # 標籤共享服務
│       │   ├── hooks/
│       │   │   ├── useTagList.ts               # 獲取標籤列表的 Hook
│       │   │   ├── useCreateTag.ts             # 建立標籤的 Hook
│       │   │   └── useDeleteTag.ts             # 刪除標籤的 Hook├── domain/
│   └── projectmanager/
│       ├── engineering/
│       │   ├── engineering-entity.ts           # 工程實體定義
│       │   ├── engineering-repository.ts       # 工程數據操作邏輯
│       │   ├── engineering-service.ts          # 工程業務邏輯處理
│       │   ├── engineering-events.ts           # 工程事件定義與處理
│       │   └── engineering-services.ts         # 工程相關的共享服務
│       ├── engineering-template/
│       │   ├── engineering-template-entity.ts  # 工程模板實體定義
│       │   ├── engineering-template-repository.ts # 工程模板數據操作邏輯
│       │   ├── engineering-template-service.ts # 工程模板業務邏輯處理
│       │   ├── engineering-template-events.ts  # 工程模板事件定義與處理
│       │   └── engineering-template-services.ts # 工程模板相關的共享服務
│       ├── project/
│       │   ├── project-entity.ts               # 專案實體定義
│       │   ├── project-repository.ts           # 專案數據操作邏輯
│       │   ├── project-progress-service.ts     # 專案進度計算邏輯
│       │   ├── project-insurance-service.ts    # 專案保險邏輯處理
│       │   ├── project-service.ts              # 專案業務邏輯處理
│       │   ├── project-events.ts               # 專案事件定義與處理
│       │   └── project-services.ts             # 專案相關的共享服務
│       ├── project-template/
│       │   ├── project-template-entity.ts      # 專案模板實體定義
│       │   ├── project-template-repository.ts  # 專案模板數據操作邏輯
│       │   ├── project-template-service.ts     # 專案模板業務邏輯處理
│       │   ├── project-template-events.ts      # 專案模板事件定義與處理
│       │   └── project-template-services.ts    # 專案模板相關的共享服務
│       ├── task/
│       │   ├── task-entity.ts                  # 任務實體定義
│       │   ├── task-repository.ts              # 任務數據操作邏輯
│       │   ├── task-progress-service.ts        # 任務進度計算邏輯
│       │   ├── task-service.ts                 # 任務業務邏輯處理
│       │   ├── task-events.ts                  # 任務事件定義與處理
│       │   ├── task-dependency-entity.ts       # 任務依賴實體定義
│       │   ├── task-dependency-service.ts      # 任務依賴業務邏輯處理
│       │   └── task-services.ts                # 任務相關的共享服務
│       ├── task-template/
│       │   ├── task-template-entity.ts         # 任務模板實體定義
│       │   ├── task-template-repository.ts     # 任務模板數據操作邏輯
│       │   ├── task-template-service.ts        # 任務模板業務邏輯處理
│       │   ├── task-template-events.ts         # 任務模板事件定義與處理
│       │   └── task-template-services.ts       # 任務模板相關的共享服務
│       ├── subtask/
│       │   ├── subtask-entity.ts               # 子任務實體定義
│       │   ├── subtask-repository.ts           # 子任務數據操作邏輯
│       │   ├── subtask-progress-service.ts     # 子任務進度計算邏輯
│       │   ├── subtask-service.ts              # 子任務業務邏輯處理
│       │   ├── subtask-events.ts               # 子任務事件定義與處理
│       │   └── subtask-services.ts             # 子任務相關的共享服務
│       ├── notification/
│       │   ├── notification-entity.ts          # 通知實體定義
│       │   ├── notification-repository.ts      # 通知數據操作邏輯
│       │   ├── notification-service.ts         # 通知業務邏輯處理
│       │   ├── notification-events.ts          # 通知事件定義與處理
│       │   └── notification-settings.ts        # 通知設定業務邏輯
│       ├── attachment/
│       │   ├── attachment-entity.ts            # 附件實體定義
│       │   ├── attachment-repository.ts        # 附件數據操作邏輯
│       │   ├── attachment-service.ts           # 附件業務邏輯處理
│       │   └── attachment-events.ts            # 附件事件定義與處理
│       ├── tag/
│       │   ├── tag-entity.ts                   # 標籤實體定義
│       │   ├── tag-repository.ts               # 標籤數據操作邏輯
│       │   ├── tag-service.ts                  # 標籤業務邏輯處理
│       │   └── tag-events.ts                   # 標籤事件定義與處理
├── infrastructure/
│   └── projectmanager/
│       ├── engineering/
│       │   ├── engineering-service.ts             # 工程相關的數據處理（API/DB 操作封裝）
│       │   ├── engineering-aggregation-service.ts # 工程相關的數據聚合邏輯
│       │   ├── engineering-util.ts                # 工程相關的工具函數
│       │   ├── engineering-adapters.ts            # 工程適配邏輯
│       │   ├── engineering-repositories.ts        # 工程數據庫操作邏輯
│       │   └── engineering-services.ts            # 工程共享服務
│       ├── engineering-template/
│       │   ├── engineering-template-service.ts    # 工程模板相關的數據處理
│       │   ├── engineering-template-util.ts       # 工程模板相關的工具函數
│       │   ├── engineering-template-adapters.ts   # 工程模板適配邏輯
│       │   ├── engineering-template-repositories.ts # 工程模板數據庫操作邏輯
│       │   └── engineering-template-services.ts   # 工程模板共享服務
│       ├── project/
│       │   ├── project-service.ts                 # 專案相關的數據處理
│       │   ├── project-insurance-service.ts       # 專案保險的數據處理
│       │   ├── project-aggregation-service.ts     # 專案相關的數據聚合邏輯
│       │   ├── project-util.ts                    # 專案相關的工具函數
│       │   ├── project-adapters.ts                # 專案適配邏輯
│       │   ├── project-repositories.ts            # 專案數據庫操作邏輯
│       │   └── project-services.ts                # 專案共享服務
│       ├── project-template/
│       │   ├── project-template-service.ts        # 專案模板相關的數據處理
│       │   ├── project-template-util.ts           # 專案模板相關的工具函數
│       │   ├── project-template-adapters.ts       # 專案模板適配邏輯
│       │   ├── project-template-repositories.ts   # 專案模板數據庫操作邏輯
│       │   └── project-template-services.ts       # 專案模板共享服務
│       ├── task/
│       │   ├── task-service.ts                    # 任務相關的數據處理
│       │   ├── task-progress-service.ts           # 任務進度計算邏輯
│       │   ├── task-util.ts                       # 任務相關的工具函數
│       │   ├── task-adapters.ts                   # 任務適配邏輯
│       │   ├── task-repositories.ts               # 任務數據庫操作邏輯
│       │   └── task-services.ts                   # 任務共享服務
│       ├── task-template/
│       │   ├── task-template-service.ts           # 任務模板相關的數據處理
│       │   ├── task-template-util.ts              # 任務模板相關的工具函數
│       │   ├── task-template-adapters.ts          # 任務模板適配邏輯
│       │   ├── task-template-repositories.ts      # 任務模板數據庫操作邏輯
│       │   └── task-template-services.ts          # 任務模板共享服務
│       ├── subtask/
│       │   ├── subtask-service.ts                 # 子任務數據處理
│       │   ├── subtask-progress-service.ts        # 子任務進度計算邏輯
│       │   ├── subtask-util.ts                    # 子任務相關的工具函數
│       │   ├── subtask-adapters.ts                # 子任務適配邏輯
│       │   ├── subtask-repositories.ts            # 子任務數據庫操作邏輯
│       │   └── subtask-services.ts                # 子任務共享服務
│       ├── notification/
│       │   ├── notification-repositories.ts    # 通知數據庫操作邏輯
│       │   ├── notification-adapters.ts        # 通知適配邏輯
│       │   ├── notification-util.ts            # 通知相關工具函數
│       │   └── notification-services.ts        # 通知共享服務
│       ├── attachment/
│       │   ├── attachment-repositories.ts      # 附件數據庫操作邏輯
│       │   ├── attachment-adapters.ts          # 附件適配邏輯
│       │   ├── attachment-util.ts              # 附件相關工具函數
│       │   └── attachment-services.ts          # 附件共享服務
│       ├── tag/
│       │   ├── tag-repositories.ts             # 標籤數據庫操作邏輯
│       │   ├── tag-adapters.ts                 # 標籤適配邏輯
│       │   ├── tag-util.ts                     # 標籤相關工具函數
│       │   └── tag-services.ts                 # 標籤共享服務
│       ├── task/
│       │   ├── task-dependency-repositories.ts # 任務依賴數據庫操作邏輯
│       │   ├── task-dependency-adapters.ts     # 任務依賴適配邏輯
│       │   └── task-services.ts                # 任務共享服務
│       ├── utils/
│       │   ├── validation-util.ts                 # 數據驗證工具
│       │   ├── calculation-util.ts                # 通用進度計算工具
│       ├── logging/
│       │   └── logging-service.ts                 # 日誌記錄服務
│       ├── error/
│       │   └── error-handler-service.ts           # 錯誤處理服務
│       ├── external/
│           └── external-api-service.ts            # 第三方 API 整合服務
src/
├── interfaces/
│   └── projectmanager/
│       ├── engineering/
│       │   ├── components/
│       │   │   ├── engineering-components-card.tsx         # 工程卡片組件
│       │   │   ├── engineering-components-list.tsx         # 工程列表組件
│       │   │   ├── engineering-components-table.tsx        # 工程表格組件
│       │   │   └── engineering-components-form.tsx         # 工程表單組件
│       │   ├── hooks/
│       │   │   ├── useEngineeringList.ts                   # 獲取工程列表的 Hook
│       │   │   ├── useEngineeringDetails.ts                # 獲取工程詳細資料的 Hook
│       │   │   ├── useCreateEngineering.ts                 # 建立工程的 Hook
│       │   │   └── useUpdateEngineering.ts                 # 更新工程的 Hook
│       ├── engineering-template/
│       │   ├── components/
│       │   │   ├── engineering-template-components-card.tsx # 工程模板卡片組件
│       │   │   ├── engineering-template-components-list.tsx # 工程模板列表組件
│       │   │   └── engineering-template-components-form.tsx # 工程模板表單組件
│       │   ├── hooks/
│       │   │   ├── useEngineeringTemplateList.ts           # 獲取工程模板列表的 Hook
│       │   │   ├── useCreateEngineeringTemplate.ts         # 建立工程模板的 Hook
│       │   │   └── useUpdateEngineeringTemplate.ts         # 更新工程模板的 Hook
│       ├── project/
│       │   ├── components/
│       │   │   ├── project-components-card.tsx             # 專案卡片組件
│       │   │   ├── project-components-list.tsx             # 專案列表組件
│       │   │   ├── project-components-table.tsx            # 專案表格組件
│       │   │   └── project-components-form.tsx             # 專案表單組件
│       │   ├── hooks/
│       │   │   ├── useProjectList.ts                       # 獲取專案列表的 Hook
│       │   │   ├── useProjectDetails.ts                    # 獲取專案詳細資料的 Hook
│       │   │   ├── useCreateProject.ts                     # 建立專案的 Hook
│       │   │   └── useUpdateProject.ts                     # 更新專案的 Hook
│       ├── project-template/
│       │   ├── components/
│       │   │   ├── project-template-components-card.tsx     # 專案模板卡片組件
│       │   │   ├── project-template-components-list.tsx     # 專案模板列表組件
│       │   │   └── project-template-components-form.tsx     # 專案模板表單組件
│       │   ├── hooks/
│       │   │   ├── useProjectTemplateList.ts               # 獲取專案模板列表的 Hook
│       │   │   ├── useCreateProjectTemplate.ts             # 建立專案模板的 Hook
│       │   │   └── useUpdateProjectTemplate.ts             # 更新專案模板的 Hook
│       ├── task/
│       │   ├── components/
│       │   │   ├── task-components-card.tsx                # 任務卡片組件
│       │   │   ├── task-components-list.tsx                # 任務列表組件
│       │   │   ├── task-components-table.tsx               # 任務表格組件
│       │   │   ├── task-components-form.tsx                # 任務表單組件
│       │   │   └── task-dependency-list.tsx                # 任務依賴列表組件
│       │   ├── hooks/
│       │   │   ├── useTaskList.ts                          # 獲取任務列表的 Hook
│       │   │   ├── useTaskDetails.ts                       # 獲取任務詳細資料的 Hook
│       │   │   ├── useCreateTask.ts                        # 建立任務的 Hook
│       │   │   └── useManageTaskDependencies.ts            # 管理任務依賴的 Hook
│       ├── task-template/
│       │   ├── components/
│       │   │   ├── task-template-components-card.tsx        # 任務模板卡片組件
│       │   │   ├── task-template-components-list.tsx        # 任務模板列表組件
│       │   │   └── task-template-components-form.tsx        # 任務模板表單組件
│       │   ├── hooks/
│       │   │   ├── useTaskTemplateList.ts                  # 獲取任務模板列表的 Hook
│       │   │   ├── useCreateTaskTemplate.ts                # 建立任務模板的 Hook
│       │   │   └── useUpdateTaskTemplate.ts                # 更新任務模板的 Hook
│       ├── subtask/
│       │   ├── components/
│       │   │   ├── subtask-components-card.tsx             # 子任務卡片組件
│       │   │   ├── subtask-components-list.tsx             # 子任務列表組件
│       │   │   ├── subtask-components-table.tsx            # 子任務表格組件
│       │   │   └── subtask-components-form.tsx             # 子任務表單組件
│       │   ├── hooks/
│       │   │   ├── useSubtaskList.ts                       # 獲取子任務列表的 Hook
│       │   │   ├── useSubtaskDetails.ts                    # 獲取子任務詳細資料的 Hook
│       │   │   └── useCreateSubtask.ts                     # 建立子任務的 Hook
│       ├── notification/
│       │   ├── components/
│       │   │   ├── notification-list.tsx                   # 通知列表組件
│       │   │   ├── notification-settings-form.tsx          # 通知設定表單組件
│       │   │   └── notification-template-form.tsx          # 通知模板表單組件
│       │   ├── hooks/
│       │   │   ├── useNotificationList.ts                  # 獲取通知列表的 Hook
│       │   │   ├── useNotificationSettings.ts              # 管理通知設定的 Hook
│       │   │   └── useCreateNotification.ts                # 建立通知的 Hook
│       ├── attachment/
│       │   ├── components/
│       │   │   ├── attachment-list.tsx                     # 附件列表組件
│       │   │   ├── attachment-upload-form.tsx              # 附件上傳表單組件
│       │   │   └── attachment-card.tsx                     # 附件卡片組件
│       │   ├── hooks/
│       │   │   ├── useAttachmentList.ts                    # 獲取附件列表的 Hook
│       │   │   ├── useUploadAttachment.ts                  # 上傳附件的 Hook
│       │   │   └── useDeleteAttachment.ts                  # 刪除附件的 Hook
│       ├── tag/
│       │   ├── components/
│       │   │   ├── tag-list.tsx                            # 標籤列表組件
│       │   │   ├── tag-form.tsx                            # 標籤表單組件
│       │   │   └── tag-card.tsx                            # 標籤卡片組件
│       │   ├── hooks/
│       │   │   ├── useTagList.ts                           # 獲取標籤列表的 Hook
│       │   │   ├── useCreateTag.ts                         # 建立標籤的 Hook
│       │   │   └── useDeleteTag.ts                         # 刪除標籤的 Hook
```
## 架構原則

### 遵循 DDD 原則，分層設計

- 將系統邏輯分為 domain（核心領域邏輯）、application（應用協調邏輯）、infrastructure（基礎設施層）和 interfaces（界面層）。
- 各層關注點清晰，避免耦合。
- 確保每層只關注其責任範圍，例如：
  - domain 層只處理純業務邏輯。
  - application 層負責協調操作和邏輯流程。

### 使用 Prisma 作為 ORM，確保型別安全

- 通過 Prisma schema 定義數據模型，確保數據結構與應用程序邏輯保持一致性。
- 避免直接操作數據庫，通過基礎設施層的 repositories 封裝數據交互。

### 最小化客戶端邏輯，將業務邏輯封裝於領域層與應用層

- 界面層（interfaces）僅負責處理用戶交互（如 React 組件）和與應用層的通信。
- 避免將業務邏輯直接放置於界面層。
- 將複雜處理（如計算進度、數據驗證）委託給應用層和領域層，確保邏輯的可測試性與可重用性。

### Hooks 的使用與位置

- Hooks 應放置於界面層（interfaces）的 hooks 子目錄中，用於處理與 React 組件相關的狀態管理和 API 請求。
- Hooks 命名應與功能保持一致，並封裝具體的操作邏輯，減少組件內部的複雜度。

### 應用層的協調角色

- 應用層（application）負責調用領域層邏輯，並與基礎設施層交互以完成具體操作。
- 將應用層的行為封裝為服務或操作文件（如 actions、services），便於界面層通過 hooks 使用。

### 基礎設施層的抽象

- 基礎設施層（infrastructure）負責與外部系統（如數據庫、API）的交互，並對外提供統一接口（如 repositories）。
- 將基礎設施細節（如數據聚合、適配器、工具函數）封裝，避免外部層直接依賴具體實現。

### 領域層的核心地位

- 領域層（domain）是系統的核心，處理業務規則和邏輯。
- 通過實體（entities）、值對象（value objects）和領域服務（services）表達業務模型。
- 保持領域層的純粹性，避免引入框架特定的細節或外部依賴。

### 文件結構與命名一致性

- 每層的文件結構應保持清晰一致，避免混淆功能邏輯。
- 文件命名應清楚表達其功能和責任範圍，例如：

### 關注點分離

- 確保各層的責任單一，避免將數據處理邏輯、業務邏輯和界面邏輯混在一起。
- 通過分層設計提高系統的可維護性和可測試性。

