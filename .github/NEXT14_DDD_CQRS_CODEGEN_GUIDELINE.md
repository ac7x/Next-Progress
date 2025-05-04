請生成符合 **Next.js 14 + Server Components + DDD + CQRS 架構最佳實踐** 的完整模組代碼。
# Next.js 14 + Server Components + DDD + CQRS 架構最佳實踐規範

## 核心目標

- ✅ **職責分離** (Separation of Responsibility)  
  每層只負責單一職責，降低模組耦合

- ✅ **關注點分離** (Separation of Concerns)  
  清楚拆分 Domain Logic / Application Logic / Infrastructure / UI Concern

- ✅ **最小化客戶端** (Minimal Client — Server-first)  
  資料存取與邏輯盡可能在 Server Components / Server Action 處理

- ✅ **領域驅動設計 (DDD)** (Domain-Driven Design)  
  以業務核心為導向設計 Entity / Aggregate / Repository / Domain Service

- ✅ **命令查詢責任分離 (CQRS)** (Command Query Responsibility Segregation)  
  資料查詢 (Query) 與修改 (Command) 明確分離，提升可維護性與擴展性

### 架構規範  
1️⃣ 採用 Next.js 14 App Router，Server Components 優先  
2️⃣ 完全遵守 DDD 分層 (domain, application, infrastructure, interfaces)  
3️⃣ 資料存取與商業邏輯遵守 CQRS (Command / Query 分離)  
4️⃣ TypeScript + Prisma + Zod  
5️⃣ 禁止 domain 層引用 framework 庫 (如 Prisma, Next.js)  
6️⃣ 檔案命名格式：{模組名}.{功能}.ts (無hyphen)

### 分層說明  
| 層 | 負責 | 備註 |
|----|------|------|
| **domain** | Entity, ValueObject, Aggregate, Repository Interface, Domain Service | 純TS |
| **application** | UseCase (Command / Query), Application Service | 呼叫 domain，不依賴infra |
| **infrastructure** | Repository Implementation (Prisma), External Service | 實作 repository |
| **interfaces** | Server Action, API Route (Controller), UI Component, SWR / React Query hook | UI與控制器層 |

### CQRS規範  
- **Command UseCase** (修改資料)：application 層，對應 React Query Mutation  
- **Query UseCase** (查詢資料)：application 層，對應 SWR / React Query Query  
- UI層資料流遵循下列流程圖：

```mermaid
graph TD
A[React Component]
B[SWR Hook (useSWR)]
C[React Query Hook (useQuery / useMutation)]
D[Application Service (API Route / Server Action)]
E[Domain Service / Entity / Aggregate]
F[Repository (Prisma)]
G[Database (MongoDB)]
H[SWR Cache (in-memory)]
I[React Query Cache (in-memory)]
J[Revalidate / Mutate]

A -->|render| B
A -->|render| C

B -->|get cache| H
C -->|get cache| I

H -->|hit?| B
I -->|hit?| C

H -- cache hit -->|return cached data| B
I -- cache hit -->|return cached data| C

H -- cache miss -->|call fetcher| D
I -- cache miss -->|call fetcher| D

D -->|orchestrate use case| E
E -->|domain logic| E
E -->|query| F
F -->|query| G
G -->|return data| F
F -->|return entity| E
E -->|return domain result| D
D -->|return DTO| C

C -->|update React Query cache| I
B -->|update SWR cache| H

C -->|return data| A
B -->|return data| A

J -->|mutate (invalidate cache)| I
J -->|mutate (invalidate cache)| H
J -->|trigger re-fetch| C
```

### 命名規範
- **Query UseCase**: 使用 `get` 或 `list` 作為前綴，明確表示查詢操作。
- **Command UseCase**: 使用 `create`、`update` 或 `delete` 作為前綴，明確表示修改操作。
- **React Hook**: 使用 `useQuery` 或 `useMutation` 作為前綴，對應 React Query 的功能。
