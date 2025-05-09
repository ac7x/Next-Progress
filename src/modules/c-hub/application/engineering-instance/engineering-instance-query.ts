'use server';

import { EngineeringInstanceDomainService } from '@/modules/c-hub/domain/engineering-instance';
import { engineeringInstanceRepository } from '@/modules/c-hub/infrastructure/engineering-instance/engineering-instance-repository';

const service = new EngineeringInstanceDomainService(engineeringInstanceRepository);

export async function listEngineeringsQuery() {
    return service.list();
}

export async function getEngineeringByIdQuery(id: string) {
    return service.getById(id);
}

export async function listEngineeringsByProjectQuery(projectId: string) {
    return service.listByProject(projectId);
}
