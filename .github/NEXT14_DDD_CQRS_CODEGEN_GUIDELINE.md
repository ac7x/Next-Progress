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
E[Command Service / Write Model (API Route / Server Action)]
F[Query Service / Read Model (API Route / Server Action)]
G[Domain Service / Entity / Aggregate]
H[Repository (Prisma)]
I[Database (MongoDB)]
J[SWR Cache (in-memory)]
K[React Query Cache (in-memory)]
L[Write Event Store / Command Handler]
M[Read Event Store / Query Handler]
N[Revalidate / Mutate]

A -->|render| B
A -->|render| C

B -->|get cache| J
C -->|get cache| K

J -->|hit?| B
K -->|hit?| C

J -- cache hit -->|return cached data| B
K -- cache hit -->|return cached data| C

J -- cache miss -->|call fetcher| F
K -- cache miss -->|call fetcher| F

F -->|query read model| G
F -->|query database| I
I -->|return data| G
G -->|return query result| F
F -->|return DTO| C

D -->|orchestrate command| E
E -->|command logic| E
E -->|invoke repository| H
H -->|write to database| I
I -->|return result| E
E -->|return DTO| D

C -->|update React Query cache| K
B -->|update SWR cache| J

C -->|return data| A
B -->|return data| A

N -->|mutate (invalidate cache)| K
N -->|mutate (invalidate cache)| J
N -->|trigger re-fetch| C

L -->|event store| I
M -->|read model| I
```

### 命名規範
- **Query UseCase**: 使用 `get` 或 `list` 作為前綴，明確表示查詢操作。
- **Command UseCase**: 使用 `create`、`update` 或 `delete` 作為前綴，明確表示修改操作。
- **React Hook**: 使用 `useQuery` 或 `useMutation` 作為前綴，對應 React Query 的功能。

# 架構設計核心概念整理

## Next.js 15 App Router Server Components
React 官方提出的 Server Components 機制，允許在伺服器端渲染元件，具備存取資料庫等 server-only 能力，減少前端負擔，提升效能與安全性。

---

## DDD（Domain-Driven Design）
領域驅動設計，是一種以業務領域為核心的軟體設計方法，強調用語一致性（Ubiquitous Language）、聚合（Aggregate）、界限上下文（Bounded Context）與模組化設計。

---

## Code Cohesion & Coupling（內聚與耦合）
- **高內聚**：模組內的功能彼此緊密相關。
- **低耦合**：模組間依賴最少。
良好的內聚與耦合設計能提升維護性與可讀性。

---

## CQRS（Command Query Responsibility Segregation）
指令與查詢責任分離，一種將「修改資料」與「查詢資料」邏輯完全拆開的架構模式，有助於可讀性、可擴充性與系統效能。

---

## Single Responsibility Principle（SRP）
單一職責原則，SOLID 原則之一，指每個模組或類別應只有一個改變的理由，負責單一功能。

---

## 關注點分離（Separation of Concerns, SoC）
將系統的不同功能模組（如 UI、業務邏輯、資料存取）明確區分，避免相互干擾，提高模組化程度。

---

## 職責分離（Single Responsibility Principle, SRP）
與單一職責原則相同，強調每個模組或功能點應該只專注於一個職責，避免多重責任導致的複雜度。

---

## 最小化客戶端（Thin Client / Minimal Client）
客戶端僅負責 UI 展示與輸入，邏輯、驗證與資料處理盡量下放到後端，提升安全性與一致性。

---

## 最少代碼實現（Minimal Code / Minimal Viable Code / KISS）
KISS 原則（Keep It Simple, Stupid），提倡以最簡潔、直接的方式解決問題，避免過度設計與冗餘程式碼。

---

## BFF（Backend for Frontend）
為不同前端客戶端（如 Web、Mobile、LIFF）設計專屬後端接口，聚合多來源資料並隱藏後端複雜性，實現 thin client。

---

## Atomicity / Transaction Boundary（原子性 / 交易邊界）
每次操作應為原子操作，不可分割；在多步驟操作中應確保一致性與回滾能力，與聚合根的資料一致性高度相關。

---

## Progressive Decoupling（漸進式解耦）
以漸進方式將單體系統拆解為模組或微服務，確保不犧牲開發效率與穩定性，是技術轉型常見策略。

---

## Bounded Context（界限上下文）
DDD 的核心概念之一，將系統劃分為語意一致、責任清晰的區域，每個上下文可獨立演進與部署。

---

## Domain Events（領域事件）
反映領域內「發生了什麼事」的物件，例如 `UserRegistered`，可觸發後續處理邏輯，實現鬆耦合架構。

---

## Eventual Consistency（最終一致性）
在分散式或非同步架構中，強調資料最終會達到一致狀態，常與 CQRS、領域事件、付款流程相關。

---

## Composability（可組合性）
系統應以可組合的小模組設計，使其可重用、可擴充，常見於 React 元件、Server Actions 與 Domain Services 設計。

---