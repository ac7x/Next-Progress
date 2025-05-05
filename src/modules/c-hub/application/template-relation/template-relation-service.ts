import { TemplateRelation, TemplateType, TemplateTypes } from '@/modules/c-hub/domain/template-relation/template-relation-entity';
import { templateRelationRepository } from '@/modules/c-hub/infrastructure/template-relation/template-relation-repository';

/**
 * 模板關聯服務 - 提供在不同模板間建立關聯與查詢的功能
 */
export class TemplateRelationService {
    /**
     * 查詢指定父模板下的所有子模板關聯
     */
    async getChildRelations(parentType: TemplateType, parentId: string): Promise<TemplateRelation[]> {
        return templateRelationRepository.findByParent(parentType, parentId);
    }

    /**
     * 查詢指定父模板下特定類型的子模板關聯
     */
    async getChildRelationsByType(parentType: TemplateType, parentId: string, childType: TemplateType): Promise<TemplateRelation[]> {
        return templateRelationRepository.findByParentAndChildType(parentType, parentId, childType);
    }

    /**
     * 查詢指定子模板的所有父模板關聯
     */
    async getParentRelations(childType: TemplateType, childId: string): Promise<TemplateRelation[]> {
        return templateRelationRepository.findByChild(childType, childId);
    }

    /**
     * 建立父子模板間的關聯
     */
    async createRelation(parentType: TemplateType, parentId: string, childType: TemplateType, childId: string, orderIndex?: number): Promise<TemplateRelation> {
        return templateRelationRepository.createRelation(parentType, parentId, childType, childId, orderIndex);
    }

    /**
     * 移除父子模板間的關聯
     */
    async removeRelation(relationId: string): Promise<void> {
        await templateRelationRepository.delete(relationId);
    }

    /**
     * 移除指定的父子關聯
     */
    async removeRelationByParentAndChild(parentId: string, childId: string): Promise<void> {
        await templateRelationRepository.deleteByParentAndChild(parentId, childId);
    }

    /**
     * 更新關聯順序
     */
    async updateRelationsOrder(relations: { id: string; orderIndex: number }[]): Promise<void> {
        await templateRelationRepository.updateOrder(relations);
    }

    /**
     * 專案模板下新增工程模板關聯
     */
    async addEngineeringTemplateToProjectTemplate(projectTemplateId: string, engineeringTemplateId: string, orderIndex?: number): Promise<TemplateRelation> {
        return this.createRelation(
            TemplateTypes.PROJECT_TEMPLATE,
            projectTemplateId,
            TemplateTypes.ENGINEERING_TEMPLATE,
            engineeringTemplateId,
            orderIndex
        );
    }

    /**
     * 工程模板下新增任務模板關聯
     */
    async addTaskTemplateToEngineeringTemplate(engineeringTemplateId: string, taskTemplateId: string, orderIndex?: number): Promise<TemplateRelation> {
        return this.createRelation(
            TemplateTypes.ENGINEERING_TEMPLATE,
            engineeringTemplateId,
            TemplateTypes.TASK_TEMPLATE,
            taskTemplateId,
            orderIndex
        );
    }

    /**
     * 任務模板下新增子任務模板關聯
     */
    async addSubTaskTemplateToTaskTemplate(taskTemplateId: string, subTaskTemplateId: string, orderIndex?: number): Promise<TemplateRelation> {
        return this.createRelation(
            TemplateTypes.TASK_TEMPLATE,
            taskTemplateId,
            TemplateTypes.SUB_TASK_TEMPLATE,
            subTaskTemplateId,
            orderIndex
        );
    }

    /**
     * 獲取專案模板下所有工程模板 ID
     */
    async getEngineeringTemplateIdsByProjectTemplate(projectTemplateId: string): Promise<string[]> {
        const relations = await this.getChildRelationsByType(
            TemplateTypes.PROJECT_TEMPLATE,
            projectTemplateId,
            TemplateTypes.ENGINEERING_TEMPLATE
        );
        return relations.map(relation => relation.childId);
    }

    /**
     * 獲取工程模板下所有任務模板 ID
     */
    async getTaskTemplateIdsByEngineeringTemplate(engineeringTemplateId: string): Promise<string[]> {
        const relations = await this.getChildRelationsByType(
            TemplateTypes.ENGINEERING_TEMPLATE,
            engineeringTemplateId,
            TemplateTypes.TASK_TEMPLATE
        );
        return relations.map(relation => relation.childId);
    }

    /**
     * 獲取任務模板下所有子任務模板 ID
     */
    async getSubTaskTemplateIdsByTaskTemplate(taskTemplateId: string): Promise<string[]> {
        const relations = await this.getChildRelationsByType(
            TemplateTypes.TASK_TEMPLATE,
            taskTemplateId,
            TemplateTypes.SUB_TASK_TEMPLATE
        );
        return relations.map(relation => relation.childId);
    }
}

export const templateRelationService = new TemplateRelationService();