src/
├── application/
│   └── warehouse/
│       ├── command/
│       │   ├── warehouse-create-command.ts
│       │   ├── warehouse-update-command.ts
│       │   ├── warehouse-delete-command.ts
│       │   ├── warehouse-item-add-command.ts
│       │   ├── warehouse-item-update-command.ts
│       │   ├── warehouse-item-remove-command.ts
│       │   ├── handlers/
│       │   │   ├── warehouse-create-handler.ts
│       │   │   ├── warehouse-update-handler.ts
│       │   │   ├── warehouse-delete-handler.ts
│       │   │   ├── warehouse-item-add-handler.ts
│       │   │   ├── warehouse-item-update-handler.ts
│       │   │   └── warehouse-item-remove-handler.ts
│       │   └── dtos/
│       │       ├── warehouse-create-dto.ts
│       │       ├── warehouse-update-dto.ts
│       │       ├── warehouse-delete-dto.ts
│       │       ├── warehouse-item-add-dto.ts
│       │       ├── warehouse-item-update-dto.ts
│       │       └── warehouse-item-remove-dto.ts
│       └── query/
│           ├── warehouse-get-by-id-query.ts
│           ├── warehouse-list-query.ts
│           ├── handlers/
│           │   ├── warehouse-get-by-id-handler.ts
│           │   └── warehouse-list-handler.ts
│           └── dtos/
│               ├── warehouse-dto.ts
│               └── warehouse-list-dto.ts
├── domain/
│   └── warehouse/
│       ├── entities/
│       │   └── warehouse.entity.ts
│       ├── aggregates/
│       │   └── warehouse.aggregate.ts
│       ├── value-objects/
│       │   ├── warehouse-id.vo.ts
│       │   ├── warehouse-location.vo.ts
│       │   ├── warehouse-capacity.vo.ts
│       │   ├── warehouse-item-id.vo.ts
│       │   ├── warehouse-item-name.vo.ts
│       │   └── warehouse-item-quantity.vo.ts
│       ├── repositories/
│       │   └── warehouse.repository.ts   # interface
│       ├── services/
│       │   └── warehouse-domain-service.ts
│       ├── events/
│       │   ├── warehouse-created-event.ts
│       │   ├── warehouse-updated-event.ts
│       │   ├── warehouse-deleted-event.ts
│       │   ├── warehouse-item-added-event.ts
│       │   ├── warehouse-item-updated-event.ts
│       │   └── warehouse-item-removed-event.ts
│       ├── specs/
│       │   ├── warehouse-can-add-item.spec.ts
│       │   ├── warehouse-can-update-item.spec.ts
│       │   └── warehouse-can-remove-item.spec.ts
│       └── factories/
│           └── warehouse.factory.ts
├── infrastructure/
│   └── warehouse/
│       ├── repositories/
│       │   └── warehouse-memory-repository.ts   # 先 memory 實作 (in-memory adapter)
│       └── services/
│           └── warehouse-external-validator-service.ts
└── interfaces/
    └── warehouse/
        ├── rest/
        │   ├── warehouse-controller.ts
        │   ├── warehouse-router.ts
        │   └── dtos/
        │       ├── warehouse-create-request-dto.ts
        │       ├── warehouse-update-request-dto.ts
        │       ├── warehouse-delete-request-dto.ts
        │       ├── warehouse-item-add-request-dto.ts
        │       ├── warehouse-item-update-request-dto.ts
        │       └── warehouse-item-remove-request-dto.ts
        └── graphql/
            ├── warehouse-resolver.ts
            ├── warehouse-graphql.ts
            └── dtos/
                ├── warehouse-create-input.ts
                ├── warehouse-update-input.ts
                ├── warehouse-item-add-input.ts
                ├── warehouse-item-update-input.ts
                └── warehouse-type.ts
