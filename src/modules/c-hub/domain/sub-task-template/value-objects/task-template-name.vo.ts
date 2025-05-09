export class TaskTemplateName {
    private readonly value: string;

    constructor(value: string) {
        if (!value || !value.trim()) {
            throw new Error('任務模板名稱不能為空');
        }
        if (value.length > 100) {
            throw new Error('任務模板名稱長度不能超過 100 字元');
        }
        this.value = value.trim();
    }

    getValue(): string {
        return this.value;
    }
}
