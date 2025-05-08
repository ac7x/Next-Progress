# ProjectManagement Interface Layer

本資料夾屬於 DDD 的 **Interfaces Layer**（對外介面層），專責「專案實體管理」的前端互動、API 輸入/輸出格式與驗證。  
**此層僅負責資料展示、用戶互動與請求轉發，不包含任何業務邏輯。所有業務操作應委派給 Application/Domain 層。**

---

## 架構原則

- ✅ **單一職責原則 (SRP)**  
  每個模組/檔案僅負責一項明確職責，降低耦合、提升可維護性。
- ✅ **命令查詢責任分離 (CQRS)**  
  查詢（Query）與修改（Command）明確分離，提升可讀性與擴展性。
- ✅ **最小化客戶端 (Minimal Client)**  
  所有資料存取與邏輯盡可能於 Server Components / Server Actions 處理，前端僅負責渲染與互動。
- ✅ **領域驅動設計 (DDD)**  
  以業務核心為導向設計 Entity / Aggregate / Repository / Domain Service，確保業務規則集中於領域層。

---

## 目標

- 實現「專案實體」列表、管理、工程/任務/子任務管理、百分比與進度顯示的 UI 與互動流程
- 嚴格遵循 SRP 與 CQRS，確保查詢與命令分離
- 前端僅負責資料展示與用戶互動，所有業務邏輯委派給 Server Actions

---

## 架構流程圖

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

---

## 注意事項

- **請勿在此層實現任何業務規則**，僅作為領域模型的對外橋樑。
- **所有查詢與命令請分開設計**，並委派給 Application/Domain 層的 Server Actions。
- **型別安全與一致性**：前端資料結構應對齊領域模型，避免重複定義型別。

---