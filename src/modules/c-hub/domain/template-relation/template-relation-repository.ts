import { CreateTemplateRelationProps, TemplateRelation, UpdateTemplateRelationProps } from './template-relation-entity';

export interface ITemplateRelationRepository {
    // 基本 CRUD 操作
    create(data: CreateTemplateRelationProps): Promise<TemplateRelation>;
    getById(id: string): Promise<TemplateRelation | null>;
    update(id: string, data: UpdateTemplateRelationProps): Promise<TemplateRelation>;
    delete(id: string): Promise<void>;

    // 查詢操作
    findByParent(parentType: string, parentId: string): Promise<TemplateRelation[]>;
    findByChild(childType: string, childId: string): Promise<TemplateRelation[]>;
    findByParentAndChildType(parentType: string, parentId: string, childType: string): Promise<TemplateRelation[]>;

    // 特定操作
    deleteByParentAndChild(parentId: string, childId: string): Promise<void>;
    createRelation(parentType: string, parentId: string, childType: string, childId: string, orderIndex?: number): Promise<TemplateRelation>;
    updateOrder(relations: { id: string, orderIndex: number }[]): Promise<void>;
}