src/
├── application/
│   └── caseHub/
│       └── entity-tag/
│           ├── command/
│           │   ├── entity-tag-create-command.ts
│           │   ├── entity-tag-update-command.ts
│           │   ├── entity-tag-delete-command.ts
│           │   ├── handlers/
│           │   │   ├── entity-tag-create-handler.ts
│           │   │   ├── entity-tag-update-handler.ts
│           │   │   └── entity-tag-delete-handler.ts
│           │   └── dtos/
│           │       ├── entity-tag-create-dto.ts
│           │       ├── entity-tag-update-dto.ts
│           │       └── entity-tag-delete-dto.ts
│           └── query/
│               ├── entity-tag-get-by-id-query.ts
│               ├── entity-tag-list-query.ts
│               ├── handlers/
│               │   ├── entity-tag-get-by-id-handler.ts
│               │   └── entity-tag-list-handler.ts
│               └── dtos/
│                   ├── entity-tag-dto.ts
│                   └── entity-tag-list-dto.ts
├── domain/
│   └── caseHub/
│       └── entity-tag/
│           ├── entities/
│           │   └── entity-tag-entity.ts
│           ├── aggregates/
│           │   └── entity-tag-aggregate.ts
│           ├── value-objects/
│           │   ├── entity-tag-id-vo.ts
│           │   ├── entity-tag-name-vo.ts
│           │   └── entity-tag-color-vo.ts
│           ├── repositories/
│           │   └── entity-tag-repository.ts   # interface
│           ├── services/
│           │   └── entity-tag-domain-service.ts
│           ├── events/
│           │   ├── entity-tag-created-event.ts
│           │   ├── entity-tag-updated-event.ts
│           │   └── entity-tag-deleted-event.ts
│           ├── specs/
│           │   ├── entity-tag-is-name-unique-spec.ts
│           │   └── entity-tag-can-delete-spec.ts
│           └── factories/
│               └── entity-tag-factory.ts
├── infrastructure/
│   └── caseHub/
│       └── entity-tag/
│           ├── repositories/
│           │   └── entity-tag-memory-repository.ts   # 先 memory 實作 (in-memory adapter)
│           └── services/
│               └── entity-tag-external-validator-service.ts
└── interfaces/
    └── caseHub/
        └── entity-tag/
            ├── rest/
            │   ├── entity-tag-controller.ts
            │   ├── entity-tag-router.ts
            │   └── dtos/
            │       ├── entity-tag-create-request-dto.ts
            │       ├── entity-tag-update-request-dto.ts
            │       ├── entity-tag-delete-request-dto.ts
            │       └── entity-tag-response-dto.ts
            └── graphql/
                ├── entity-tag-resolver.ts
                ├── entity-tag-graphql.ts
                └── dtos/
                    ├── entity-tag-create-input.ts
                    ├── entity-tag-update-input.ts
                    └── entity-tag-type.ts
