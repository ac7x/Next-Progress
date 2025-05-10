/**
 * 工程模板刪除事件
 * 當工程模板被成功刪除時觸發
 */
export class EngineeringTemplateDeletedEvent {
    constructor(
        public readonly templateId: string
    ) {
        console.log(`工程模板已刪除: ${templateId}`);
    }
}