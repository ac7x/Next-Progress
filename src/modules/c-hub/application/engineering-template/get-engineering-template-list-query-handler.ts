import { EngineeringTemplate } from '@/modules/c-hub/domain/engineering-template/engineering-template-entity';
import { engineeringTemplateQueryService } from '@/modules/c-hub/infrastructure/engineering-template/engineering-template-query-service';

export class GetEngineeringTemplateListQueryHandler {
    async execute(): Promise<EngineeringTemplate[]> {
        return engineeringTemplateQueryService.list();
    }
}

export const getEngineeringTemplateListQueryHandler = new GetEngineeringTemplateListQueryHandler();
