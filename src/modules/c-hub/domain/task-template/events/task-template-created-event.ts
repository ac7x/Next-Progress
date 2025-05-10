/**
 * 任務模板創建事件
 * 當成功創建任務模板時觸發
 */
export class TaskTemplateCreatedEvent {
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
    return 'task-template.created';
  }
}