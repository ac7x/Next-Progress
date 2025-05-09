export class SubTaskInstanceStatus {
    private readonly value: string;

    constructor(value: string) {
        const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(value)) {
            throw new Error(`無效的子任務實體狀態: ${value}`);
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}
