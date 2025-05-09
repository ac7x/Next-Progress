export class SubTaskInstancePriority {
    private readonly value: number;

    constructor(value: number) {
        if (![0, 1, 2].includes(value)) {
            throw new Error('子任務實體優先級必須為 0（高）、1（中）、2（低）');
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}
