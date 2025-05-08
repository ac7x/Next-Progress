// ProjectInstance Description Value Object
export type ProjectInstanceDescription = string | null;

export function isValidProjectInstanceDescription(desc: unknown): desc is ProjectInstanceDescription {
    return typeof desc === 'string' || desc === null;
}