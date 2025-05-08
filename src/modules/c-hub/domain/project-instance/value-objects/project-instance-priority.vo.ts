// ProjectInstance Priority Value Object
export type ProjectInstancePriority = number;

export function isValidProjectInstancePriority(priority: unknown): priority is ProjectInstancePriority {
    return typeof priority === 'number' && priority >= 0 && priority <= 9;
}