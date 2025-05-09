/**
 * 子任務模板更新事件
 * 當子任務模板的屬性被修改時觸發
 */
export class SubTaskTemplateUpdatedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string
    ) { }
}