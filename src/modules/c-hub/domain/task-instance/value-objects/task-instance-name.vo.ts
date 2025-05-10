export class TaskInstanceName {
    private readonly value: string;
    private static readonly MAX_LENGTH = 100;
    private static readonly MIN_LENGTH = 2;

    constructor(value: string | null | undefined) {
        const trimmedValue = value?.trim() || '';

        if (trimmedValue.length < TaskInstanceName.MIN_LENGTH) {
            throw new Error(`任務名稱太短，至少需要 ${TaskInstanceName.MIN_LENGTH} 個字元`);
        }

        if (trimmedValue.length > TaskInstanceName.MAX_LENGTH) {
            throw new Error(`任務名稱太長，最多允許 ${TaskInstanceName.MAX_LENGTH} 個字元`);
        }

        this.value = trimmedValue;
    }

    getValue(): string {
        return this.value;
    }
}