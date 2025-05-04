// 工程建立表單元件，提供用戶輸入工程資料並提交
// - EngineeringInstanceCreateForm: React 元件，負責渲染工程建立表單，並調用 mutation 完成工程建立
export * from './components/engineering-instance-create-form';

// 建立工程的 mutation hook，推薦用於表單提交，並自動刷新工程與專案列表
// - useCreateEngineeringInstanceMutation: React Query mutation hook，呼叫建立工程的 server action，成功後自動刷新工程與專案列表
export * from './hooks/useCreateEngineeringInstanceMutation';

// 查詢工程列表的 hook，負責從伺服器取得工程資料
// - useEngineeringInstancesQuery: React Query query hook，查詢所有工程實例，回傳工程列表資料
export * from './hooks/useEngineeringInstancesQuery';

// 工程列表元件，負責顯示所有工程實例（已廢棄，請用上方 hooks）
// - useCreateEngineeringInstance: 舊版建立工程的 mutation hook，功能與 useCreateEngineeringInstanceMutation 類似，建議統一用新版
export * from './hooks/useCreateEngineeringInstance';

