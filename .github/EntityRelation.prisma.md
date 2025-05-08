enum EntityRelationKind {
  CONTAINS
  BELONGS_TO
  DEPENDS_ON
  REQUIRED_BY
  TEMPLATE_OF
  INSTANCE_OF
  HAS_MEMBER
  MEMBER_OF
  PREVIOUS_STATE
  NEXT_STATE
  VERSION_OF
  HAS_VERSION
  CREATED_BY
  MODIFIED_BY
  ATTACHED_TO
  HAS_ATTACHMENT
  TAGGED_WITH
  TAGS
  // --- 進銷存相關 ---
  STOCK_IN      // 入庫
  STOCK_OUT     // 出庫
  TRANSFER      // 調撥
}

enum EntityKind {
  PROJECT_INSTANCE
  PROJECT_TEMPLATE
  ENGINEERING_INSTANCE
  ENGINEERING_TEMPLATE
  TASK_INSTANCE
  TASK_TEMPLATE
  SUBTASK_INSTANCE
  SUBTASK_TEMPLATE
  USER
  DOCUMENT
  COMMENT
  NOTIFICATION
  WAREHOUSE
  WAREHOUSE_ITEM
  TAG
}

enum EntityNotificationKind {
  TASK_DUE_SOON
  NEW_COMMENT
  SYSTEM_ALERT
  // ...可依需求擴充...
}

enum EntityNotificationChannel {
  LINE
  EMAIL
  APP
  // ...可依需求擴充...
}

enum EntityNotificationStatus {
  PENDING
  SENT
  FAILED
  READ
  // ...可依需求擴充...
}

model EntityTag {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   @unique
  description String?
  color       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  entities    EntityRelationTag[]
}

model EntityRelationTag {
  id         String                 @id @default(auto()) @map("_id") @db.ObjectId
  entityType EntityKind
  entityId   String                 @db.ObjectId
  tagId      String                 @db.ObjectId
  createdAt  DateTime               @default(now())
  updatedAt  DateTime               @default(now())
  tag        EntityTag              @relation(fields: [tagId], references: [id])
  @@unique([entityType, entityId, tagId])
  @@index([entityType, entityId])
  @@index([tagId])
}

model EntityRelation {
  id              String           @id @default(auto()) @map("_id") @db.ObjectId
  sourceType      EntityKind
  sourceId        String           @db.ObjectId
  targetType      EntityKind
  targetId        String           @db.ObjectId
  relationType    EntityRelationKind
  orderIndex      Int?             @default(0)
  metadata        Json?            // metadata 欄位可存放進銷存細節，例如：
                                   // {
                                   //   "quantity": 10,
                                   //   "unitPrice": 100,
                                   //   "operatorId": "xxx",
                                   //   "remark": "年度盤點"
                                   // }
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  @@index([sourceType, sourceId])
  @@index([targetType, targetId])
}

model EntityNotification {
  id          String                   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  content     String?
  type        EntityNotificationKind?
  read        Boolean                  @default(false)
  recipientId String                   @db.ObjectId
  status      EntityNotificationStatus @default(PENDING)
  createdAt   DateTime                 @default(now())
  updatedAt   DateTime                 @default(now())
}

model EntityNotificationSetting {
  id        String                   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String                   @db.ObjectId
  type      EntityNotificationKind
  channel   EntityNotificationChannel
  enabled   Boolean                  @default(true)
  createdAt DateTime                 @default(now())
  updatedAt DateTime                 @default(now())
  @@index([userId])
}

model Warehouse {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String?
  location    String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

}

model WarehouseItem {
  id          String            @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String?
  quantity    Int               @default(0)
  unit        String?
  type        WarehouseItemType @default(TOOL)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @default(now())

  @@index([type])
}

enum WarehouseItemType {
  TOOL      // 工具
  EQUIPMENT // 設備
  CONSUMABLE // 耗材
}