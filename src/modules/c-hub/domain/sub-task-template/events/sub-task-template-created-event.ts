/**
 * 子任務模板創建事件
 * 當新的子任務模板被成功創建時觸發
 */
export class SubTaskTemplateCreatedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly taskTemplateId: string
    ) { }
}