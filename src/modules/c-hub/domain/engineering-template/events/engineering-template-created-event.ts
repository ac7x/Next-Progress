/**
 * 工程模板創建事件
 * 當新的工程模板被成功創建時觸發
 */
export class EngineeringTemplateCreatedEvent {
    constructor(
        public readonly templateId: string,
        public readonly name: string
    ) {
        console.log(`工程模板已創建: ${name} (${templateId})`);
    }
}