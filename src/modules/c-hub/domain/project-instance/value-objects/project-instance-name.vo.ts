// ProjectInstance Name Value Object
export type ProjectInstanceName = string;

export function isValidProjectInstanceName(name: unknown): name is ProjectInstanceName {
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 100;
}