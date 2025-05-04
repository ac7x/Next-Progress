import { EngineeringTemplate } from '@/modules/c-hub/domain/engineering-template/engineering-template-entity';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { engineeringTemplateAdapter } from './engineering-template-adapter';

export class EngineeringTemplateQueryService {
    async list(): Promise<EngineeringTemplate[]> {
        const prismaTemplates = await prisma.engineeringTemplate.findMany();
        return prismaTemplates.map(engineeringTemplateAdapter.toDomain);
    }
}

export const engineeringTemplateQueryService = new EngineeringTemplateQueryService();
