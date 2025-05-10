export class TaskInstanceDescription {
    private readonly value: string | null;
    private static readonly MAX_LENGTH = 2000;

    constructor(value: string | null | undefined) {
        const trimmedValue = value?.trim() || null;

        if (trimmedValue !== null && trimmedValue.length > TaskInstanceDescription.MAX_LENGTH) {
            throw new Error(`任務描述太長，最多允許 ${TaskInstanceDescription.MAX_LENGTH} 個字元`);
        }

        this.value = trimmedValue;
    }

    getValue(): string | null {
        return this.value;
    }
}