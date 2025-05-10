/**
 * 任務模板更新事件
 * 當成功更新任務模板時觸發
 */
export class TaskTemplateUpdatedEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly engineeringId: string | null,
    public readonly timestamp: Date = new Date()
  ) {}

  /**
   * 獲取事件名稱
   */
  static eventName(): string {
    return 'task-template.updated';
  }
}