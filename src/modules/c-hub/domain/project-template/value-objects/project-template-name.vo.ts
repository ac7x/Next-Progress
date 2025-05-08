// ProjectTemplate Name Value Object
export type ProjectTemplateName = string;

export function isValidProjectTemplateName(name: unknown): name is ProjectTemplateName {
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 100;
}