/**
 * 工程模板插入事件
 * 當工程模板被成功插入到專案中時觸發
 */
export class EngineeringTemplateInsertedEvent {
    constructor(
        public readonly templateId: string,
        public readonly projectId: string,
        public readonly engineeringId: string
    ) {
        console.log(`工程模板 ${templateId} 已插入至專案 ${projectId}，創建工程 ${engineeringId}`);
    }
}