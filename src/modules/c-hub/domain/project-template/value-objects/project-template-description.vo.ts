// ProjectTemplate Description Value Object
export type ProjectTemplateDescription = string | null;

export function isValidProjectTemplateDescription(desc: unknown): desc is ProjectTemplateDescription {
    return typeof desc === 'string' || desc === null;
}