/**
 * 子任務模板刪除事件
 * 當子任務模板被刪除時觸發
 */
export class SubTaskTemplateDeletedEvent {
    constructor(public readonly id: string) { }
}