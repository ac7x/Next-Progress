// ProjectInstance CreatedBy Value Object
export type ProjectInstanceCreatedBy = string;

export function isValidProjectInstanceCreatedBy(createdBy: unknown): createdBy is ProjectInstanceCreatedBy {
    return typeof createdBy === 'string' && createdBy.trim().length > 0;
}