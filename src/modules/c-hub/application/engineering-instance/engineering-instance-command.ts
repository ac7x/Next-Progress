'use server';

import { CreateEngineeringInstanceProps, EngineeringInstanceDomainService } from '@/modules/c-hub/domain/engineering-instance';
import { engineeringInstanceRepository } from '@/modules/c-hub/infrastructure/engineering-instance/engineering-instance-repository';
import { revalidatePath } from 'next/cache';

const service = new EngineeringInstanceDomainService(engineeringInstanceRepository);

export async function createEngineeringCommand(data: CreateEngineeringInstanceProps) {
    const engineering = await service.create(data);
    revalidatePath(`/client/project/${engineering.projectId}`);
    revalidatePath('/client/manage');
    return engineering;
}
