export class TaskTemplatePriority {
    private readonly value: number;

    constructor(value: number) {
        if (!Number.isInteger(value) || value < 0 || value > 2) {
            throw new Error('任務模板優先級必須是 0（高）、1（中）或 2（低）');
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}
