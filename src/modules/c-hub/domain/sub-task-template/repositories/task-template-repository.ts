import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateTaskTemplateProps, TaskTemplate } from '../entities/task-template-entity';
import { ITaskTemplateRepository } from './interfaces/task-template-repository-interface';
import { taskTemplateAdapter } from './task-template-adapter';

export class TaskTemplateRepository implements ITaskTemplateRepository {
    async create(data: CreateTaskTemplateProps): Promise<TaskTemplate> {
        const prismaData = {
            name: data.name,
            description: data.description || null,
            priority: data.priority || 0,
            isActive: data.isActive ?? true,
            engineering: data.engineeringId
                ? { connect: { id: data.engineeringId } }
                : undefined,
        };

        const prismaTemplate = await prisma.taskTemplate.create({
            data: prismaData,
            include: { engineering: true },
        });

        return taskTemplateAdapter.toDomain(prismaTemplate);
    }

    async list(): Promise<TaskTemplate[]> {
        const prismaTemplates = await prisma.taskTemplate.findMany({
            include: { engineering: true },
        });

        return prismaTemplates.map(taskTemplateAdapter.toDomain);
    }

    async getById(id: string): Promise<TaskTemplate | null> {
        const prismaTemplate = await prisma.taskTemplate.findUnique({
            where: { id },
            include: { engineering: true },
        });

        return prismaTemplate ? taskTemplateAdapter.toDomain(prismaTemplate) : null;
    }

    async update(id: string, data: Partial<CreateTaskTemplateProps>): Promise<TaskTemplate> {
        const prismaData = {
            name: data.name,
            description: data.description,
            priority: data.priority,
            isActive: data.isActive,
            engineering: data.engineeringId
                ? { connect: { id: data.engineeringId } }
                : data.engineeringId === null
                    ? { disconnect: true }
                    : undefined,
        };

        const prismaTemplate = await prisma.taskTemplate.update({
            where: { id },
            data: prismaData,
            include: { engineering: true },
        });

        return taskTemplateAdapter.toDomain(prismaTemplate);
    }

    async delete(id: string): Promise<void> {
        await prisma.taskTemplate.delete({ where: { id } });
    }

    async findByEngineeringTemplateId(engineeringTemplateId: string): Promise<TaskTemplate[]> {
        const prismaTemplates = await prisma.taskTemplate.findMany({
            where: { engineeringId: engineeringTemplateId },
            include: { engineering: true },
        });

        return prismaTemplates.map(taskTemplateAdapter.toDomain);
    }
}

export const taskTemplateRepository = new TaskTemplateRepository();