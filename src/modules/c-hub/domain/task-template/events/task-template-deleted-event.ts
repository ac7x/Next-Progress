/**
 * 任務模板刪除事件
 * 當成功刪除任務模板時觸發
 */
export class TaskTemplateDeletedEvent {
  constructor(
    public readonly id: string,
    public readonly timestamp: Date = new Date()
  ) {}

  /**
   * 獲取事件名稱
   */
  static eventName(): string {
    return 'task-template.deleted';
  }
}