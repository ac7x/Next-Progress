export class SubTaskTemplateName {
    private readonly value: string;

    constructor(value: string) {
        if (!value || !value.trim()) {
            throw new Error('子任務模板名稱不能為空');
        }
        if (value.length > 50) {
            throw new Error('子任務模板名稱長度不能超過 50 字元');
        }
        this.value = value.trim();
    }

    getValue(): string {
        return this.value;
    }
}
