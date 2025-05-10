/**
 * 工程模板更新事件
 * 當工程模板被成功更新時觸發
 */
export class EngineeringTemplateUpdatedEvent {
    constructor(
        public readonly templateId: string,
        public readonly name: string
    ) {
        console.log(`工程模板已更新: ${name} (${templateId})`);
    }
}