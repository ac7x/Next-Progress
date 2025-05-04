'use server';

import { getEngineeringTemplateListQueryHandler } from '@/modules/c-hub/application/engineering-template/get-engineering-template-list-query-handler';

export async function getEngineeringTemplateListHandler() {
    return getEngineeringTemplateListQueryHandler.execute();
}
