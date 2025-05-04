// 僅負責 re-export，確保每個檔案單一職責

// 專案模板卡片元件（單一模板展示與操作）
export * from './components/project-template-card';
// 專案模板「使用此模板」按鈕元件
export * from './components/project-template-create-button';
// 專案模板建立表單元件
export * from './components/project-template-create-form';
// 專案模板建立專案的 Modal 元件
export * from './components/project-template-create-modal';
// 專案模板編輯表單元件
export * from './components/project-template-edit-form';
// 專案模板表單欄位元件（共用欄位）
export * from './components/project-template-form-fields';
// 專案模板列表元件（多個模板展示）
export * from './components/project-template-list';

// 建立專案模板的 React Hook（Command）
export * from './hooks/project-template.create';
// 查詢專案模板列表的 React Hook（Query）
export * from './hooks/project-template.query';
// 更新專案模板的 React Hook（Command）
export * from './hooks/project-template.update';

// 專案模板 Controller，對外暴露查詢/更新方法
export * from './project-template.controller';

