import type { Prisma, TaskTemplate as PrismaTaskTemplate } from '@prisma/client';
import { TaskTemplate } from '../entities/task-template-entity';
import { TaskTemplateName } from '../value-objects/task-template-name.vo';
import { TaskTemplatePriority } from '../value-objects/task-template-priority.vo';

type TaskTemplateWithRelations = PrismaTaskTemplate & {
    engineering?: { id: string; name: string } | null;
};

export const taskTemplateAdapter = {
    toDomain(prismaModel: TaskTemplateWithRelations): TaskTemplate {
        return {
            id: prismaModel.id,
            name: new TaskTemplateName(prismaModel.name),
            description: prismaModel.description,
            engineeringId: prismaModel.engineeringId,
            priority: new TaskTemplatePriority(prismaModel.priority),
            isActive: prismaModel.isActive,
            createdAt: prismaModel.createdAt,
            updatedAt: prismaModel.updatedAt,
        };
    },

    toPersistence(domainModel: Partial<TaskTemplate>): Prisma.TaskTemplateUpdateInput {
        return {
            name: domainModel.name?.getValue(),
            description: domainModel.description,
            priority: domainModel.priority?.getValue(),
            isActive: domainModel.isActive,
        };
    },
};