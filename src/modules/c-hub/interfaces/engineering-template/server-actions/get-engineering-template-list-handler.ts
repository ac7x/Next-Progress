'use server';

import { listEngineeringTemplates } from '@/modules/c-hub/application/engineering-template/engineering-template.query';

// CQRS: 僅做查詢，不做資料修改
export async function getEngineeringTemplateListHandler() {
    return listEngineeringTemplates();
}
