'use server';

import { CreateEngineeringInstanceProps } from '@/modules/c-hub/domain/engineering-instance/engineering-instance-entity';
import { EngineeringInstanceDomainService } from '@/modules/c-hub/domain/engineering-instance/engineering-instance-service';
import { engineeringInstanceRepository } from '@/modules/c-hub/infrastructure/engineering-instance/engineering-instance-repository';
import { revalidatePath } from 'next/cache';

const service = new EngineeringInstanceDomainService(engineeringInstanceRepository);

export async function createEngineeringCommand(data: CreateEngineeringInstanceProps) {
    const engineering = await service.create(data);
    revalidatePath(`/client/project/${engineering.projectId}`);
    revalidatePath('/client/manage');
    return engineering;
}
