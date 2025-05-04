'use server';

import { listEngineeringTemplates } from '@/modules/c-hub/application/engineering-template/engineering-template.query';

export async function getEngineeringTemplateListHandler() {
    return listEngineeringTemplates();
}
