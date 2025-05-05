import { CreateTemplateRelationProps, TemplateRelation } from '@/modules/c-hub/domain/template-relation/template-relation-entity';
import type { Prisma, TemplateRelation as PrismaTemplateRelation } from '@prisma/client';

type TemplateRelationWithRelations = PrismaTemplateRelation;

export const templateRelationAdapter = {
    toDomain(
        prismaModel: TemplateRelationWithRelations,
        additionalData?: Partial<CreateTemplateRelationProps>
    ): TemplateRelation {
        return {
            id: prismaModel.id,
            parentType: prismaModel.parentType,
            parentId: prismaModel.parentId,
            childType: prismaModel.childType,
            childId: prismaModel.childId,
            orderIndex: prismaModel.orderIndex,
            createdAt: prismaModel.createdAt,
            updatedAt: prismaModel.updatedAt
        };
    },

    toPersistence(domainModel: Partial<TemplateRelation>): Prisma.TemplateRelationUpdateInput {
        const data: Prisma.TemplateRelationUpdateInput = {};
        if (domainModel.parentType !== undefined) data.parentType = domainModel.parentType;
        if (domainModel.parentId !== undefined) data.parentId = domainModel.parentId;
        if (domainModel.childType !== undefined) data.childType = domainModel.childType;
        if (domainModel.childId !== undefined) data.childId = domainModel.childId;
        if (domainModel.orderIndex !== undefined) data.orderIndex = domainModel.orderIndex;
        return data;
    }
};