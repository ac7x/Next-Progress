'use server';

import { listEngineeringTemplates } from '@/modules/c-hub/application/engineering-template/engineering-template-query';
import { engineeringTemplateAdapter } from '@/modules/c-hub/infrastructure/engineering-template/engineering-template-adapter';

// CQRS: 僅做查詢，不做資料修改
export async function getEngineeringTemplateListHandler() {
    // 獲取工程模板列表
    const templates = await listEngineeringTemplates();

    // 確保所有資料都是可序列化的，將任何可能的值物件轉換為純 JavaScript 值
    return templates.map(template => engineeringTemplateAdapter.toSerializable(template));
}
