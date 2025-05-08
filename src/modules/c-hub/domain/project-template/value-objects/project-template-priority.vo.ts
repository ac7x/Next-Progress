// ProjectTemplate Priority Value Object
export type ProjectTemplatePriority = number;

export function isValidProjectTemplatePriority(priority: unknown): priority is ProjectTemplatePriority {
    return typeof priority === 'number' && priority >= 0 && priority <= 9;
}