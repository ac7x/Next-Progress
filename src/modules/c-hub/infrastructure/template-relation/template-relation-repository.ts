import {
    CreateTemplateRelationProps,
    TemplateRelation,
    UpdateTemplateRelationProps
} from '@/modules/c-hub/domain/template-relation/template-relation-entity';
import { ITemplateRelationRepository } from '@/modules/c-hub/domain/template-relation/template-relation-repository';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { Prisma } from '@prisma/client';
import { templateRelationAdapter } from './template-relation-adapter';

export class TemplateRelationRepository implements ITemplateRelationRepository {
    async create(data: CreateTemplateRelationProps): Promise<TemplateRelation> {
        try {
            // 準備建立資料
            const createData: Prisma.TemplateRelationCreateInput = {
                parentType: data.parentType,
                parentId: data.parentId,
                childType: data.childType,
                childId: data.childId,
                orderIndex: data.orderIndex ?? null
            };

            const prismaRelation = await prisma.templateRelation.create({
                data: createData
            });

            return templateRelationAdapter.toDomain(prismaRelation, data);
        } catch (error) {
            console.error('Failed to create template relation:', error);
            throw error;
        }
    }

    async getById(id: string): Promise<TemplateRelation | null> {
        const relation = await prisma.templateRelation.findUnique({
            where: { id }
        });

        if (!relation) return null;

        return templateRelationAdapter.toDomain(relation);
    }

    async update(id: string, data: UpdateTemplateRelationProps): Promise<TemplateRelation> {
        const updateData = templateRelationAdapter.toPersistence(data);

        const prismaRelation = await prisma.templateRelation.update({
            where: { id },
            data: updateData
        });

        return templateRelationAdapter.toDomain(prismaRelation);
    }

    async delete(id: string): Promise<void> {
        try {
            await prisma.templateRelation.delete({
                where: { id }
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                console.warn(`ID為 ${id} 的模板關聯不存在或已被刪除`);
                return;
            }
            console.error('Delete template relation error:', error);
            throw error;
        }
    }

    async findByParent(parentType: string, parentId: string): Promise<TemplateRelation[]> {
        const relations = await prisma.templateRelation.findMany({
            where: {
                parentType,
                parentId
            },
            orderBy: {
                orderIndex: 'asc'
            }
        });

        return relations.map(relation => templateRelationAdapter.toDomain(relation));
    }

    async findByChild(childType: string, childId: string): Promise<TemplateRelation[]> {
        const relations = await prisma.templateRelation.findMany({
            where: {
                childType,
                childId
            }
        });

        return relations.map(relation => templateRelationAdapter.toDomain(relation));
    }

    async findByParentAndChildType(parentType: string, parentId: string, childType: string): Promise<TemplateRelation[]> {
        const relations = await prisma.templateRelation.findMany({
            where: {
                parentType,
                parentId,
                childType
            },
            orderBy: {
                orderIndex: 'asc'
            }
        });

        return relations.map(relation => templateRelationAdapter.toDomain(relation));
    }

    async deleteByParentAndChild(parentId: string, childId: string): Promise<void> {
        await prisma.templateRelation.deleteMany({
            where: {
                parentId,
                childId
            }
        });
    }

    async createRelation(
        parentType: string,
        parentId: string,
        childType: string,
        childId: string,
        orderIndex?: number
    ): Promise<TemplateRelation> {
        // 如果 orderIndex 未指定，找到當前最大順序號並 +1
        if (orderIndex === undefined) {
            const maxOrderRelation = await prisma.templateRelation.findFirst({
                where: {
                    parentType,
                    parentId,
                    childType
                },
                orderBy: {
                    orderIndex: 'desc'
                }
            });

            orderIndex = maxOrderRelation ? (maxOrderRelation.orderIndex ?? 0) + 1 : 0;
        }

        return this.create({
            parentType,
            parentId,
            childType,
            childId,
            orderIndex
        });
    }

    async updateOrder(relations: { id: string, orderIndex: number }[]): Promise<void> {
        // 使用交易確保順序更新的原子性
        await prisma.$transaction(
            relations.map(({ id, orderIndex }) =>
                prisma.templateRelation.update({
                    where: { id },
                    data: { orderIndex }
                })
            )
        );
    }
}

export const templateRelationRepository = new TemplateRelationRepository();