# Next-Progress

## 項目簡介
Next-Progress 是一個以 **Domain-Driven Design (DDD)** 為核心的現代化全棧應用框架，專注於提供清晰的領域驅動開發範式與最佳實踐。本項目採用最新的技術堆棧，包括：

- **核心框架**：基於 Next.js 15 App Router 與 React 19，實現高效的服務端渲染與客戶端互動
- **架構設計**：嚴格遵循 DDD 分層架構，包含領域層、應用層、基礎設施層和展示層
- **數據持久化**：使用 Prisma 6.6.0 作為 ORM，確保數據模型與領域模型的一致性
- **前端技術**：整合 Tailwind CSS 4.0 實現現代化 UI，並支持 LIFF 2.25.1 的 LINE 應用開發
- **業務特性**：
  - 完整支持 LINE 生態系統整合（LIFF、LINE Pay、LINE Bot）
  - 採用 Server Actions 實現高效的服務端操作
  - 內建高可用性緩存策略（Redis/Edge/Memcached）
  - 支持分佈式系統架構

本框架特別適合需要構建複雜業務邏輯的企業級應用，提供了完整的 DDD 實現範例與架構指南。

---

## 技術堆棧

### 核心框架與庫
- **Next.js 15.3.1**: React 框架
- **React 19.0.0**: 用戶界面框架
- **Tailwind CSS 4.0.0**: CSS 框架
- **Prisma 6.6.0**: TypeScript ORM
- **@line/liff 2.25.1**: LINE Front-end Framework
- **@line/bot-sdk 9.9.0**: LINE Bot SDK

### 狀態管理與數據獲取
- **Zustand 5.0.3**: 輕量級狀態管理
- **@tanstack/react-query 5.74.7**: 數據獲取與快取
- **SWR 2.3.3**: React Hooks 數據獲取
- **Axios 1.8.4**: HTTP 客戶端

### 表單與驗證
- **React Hook Form 7.56.0**: 表單處理
- **@hookform/resolvers 5.0.1**: 表單驗證整合
- **Zod 3.24.3**: Schema 驗證

### 數據存儲與處理
- **@prisma/client 6.6.0**: Prisma 客戶端
- **redis 4.7.0**: Redis 客戶端
- **memjs 1.3.2**: Memcached 客戶端
- **date-fns 4.1.0**: 日期處理
- **uuid 11.1.0**: UUID 生成

### 工具與實用庫
- **lodash 4.17.21**: 實用工具函數
- **@noble/hashes 1.8.0**: 加密哈希函數
- **react-hot-toast 2.5.2**: 通知提示

### 開發工具
- **TypeScript 5**: JavaScript 的超集
- **ESLint 9.25.1**: 代碼檢查
  - **@typescript-eslint/parser 8.31.0**
  - **@typescript-eslint/eslint-plugin 8.31.0**
- **Prettier 3.5.3**: 代碼格式化
  - **prettier-plugin-tailwindcss 0.6.11**
- **@tailwindcss/postcss 4**: Tailwind PostCSS 插件

### 類型定義
- **@types/node ^20**
- **@types/react ^19**
- **@types/react-dom ^19**
- **@types/crypto-js 4.2.2**
- **@types/memjs 1.3.3**

---

## DDD 架構原則

### 1. **Domain Driven Design 核心概念**
- **實體 (Entity)**: 具有唯一標識符的領域對象
- **值對象 (Value Object)**: 無標識符的不可變對象
- **聚合 (Aggregate)**: 實體與值對象的組合，由聚合根管理
- **領域事件 (Domain Event)**: 捕獲領域中的重要變化
- **領域服務 (Domain Service)**: 處理跨實體的操作
- **倉儲 (Repository)**: 提供數據存取抽象

### 2. **Next.js 與 DDD 結合**
- 使用 Server Actions 實現應用層服務
- 確保領域邏輯與前端UI分離
- 利用 Prisma 映射領域模型到資料庫結構

## 架構概覽

本項目採用 **DDD 架構**，將代碼分為以下 4 個主要層次，每一層有明確的職責與邏輯分工：

### 1. **Domain 層 (核心業務邏輯)**
   - **職責**：處理核心業務邏輯，定義實體（Entities）、值對象（Value Objects）、聚合（Aggregates）、領域事件（Domain Events）等。
   - **內容**：
     - `entities/`：業務實體，具有唯一標識符。
     - `valueObjects/`：不可變的值對象。
     - `aggregates/`：聚合根，封裝業務邏輯。
     - `repositories/`：定義數據存取的接口。
     - `events/`：領域事件，用於處理業務邏輯中的狀態變化。

### 2. **Application 層 (應用服務)**
   - **職責**：協調領域層執行業務用例，處理應用程序的用例邏輯。
   - **內容**：
     - `services/`：應用服務，調用領域對象來完成業務用例邏輯。
     - `dtos/`：資料傳輸對象（DTO），用於在層之間傳遞數據。

### 3. **Infrastructure 層 (基礎設施)**
   - **職責**：實現數據庫、外部服務和其他技術細節的集成。
   - **內容**：
     - `adapters/`：例如數據庫適配器（如 Prisma 與 MongoDB）。
     - `repositories/`：倉儲實現，對接領域層的接口。
     - `configurations/`：應用程序配置（如 Redis 快取配置）。

### 4. **Presentation 層 (用戶界面)**
   - **職責**：處理用戶交互，負責控制器、API 路由或前端頁面。
   - **內容**：
     - `controllers/`：處理 HTTP 請求並調用應用層服務。
     - `views/`：UI 視圖（如 React 組件）。
     - `middlewares/`：API 中間件，用於處理請求流。

---

## 文件結構

以下是項目的文件夾結構：

## src/
├── domain/              # 領域層
│   ├── liff/            # LIFF 系統的領域層
│   │   ├── aggregates/  # 聚合根
│   │   ├── entities/    # 實體
│   │   ├── valueObjects/# 值對象
│   │   ├── services/    # 領域服務
│   │   ├── events/      # 領域事件
│   │   ├── repositories/# 倉儲接口
│   │   └── factories/   # 工廠
│   ├── lineBot/         # LINE Bot 系統的領域層
│   │   ├── aggregates/  # 聚合根
│   │   ├── entities/    # 實體
│   │   ├── valueObjects/# 值對象
│   │   ├── services/    # 領域服務
│   │   ├── events/      # 領域事件
│   │   ├── repositories/# 倉儲接口
│   │   └── factories/   # 工廠
│   └── other/           # 其他系統的領域層
│       ├── aggregates/  # 聚合根
│       ├── entities/    # 實體
│       ├── valueObjects/# 值對象
│       ├── services/    # 領域服務
│       ├── events/      # 領域事件
│       ├── repositories/# 倉儲接口
│       └── factories/   # 工廠
│
├── application/         # 應用層
│   ├── liff/            # LIFF 系統的應用服務
│   │   ├── services/    # 應用服務
│   │   ├── commands/    # 命令
│   │   ├── queries/     # 查詢
│   │   └── dtos/        # 數據傳輸對象（DTOs）
│   ├── lineBot/         # LINE Bot 系統的應用服務
│   │   ├── services/    # 應用服務
│   │   ├── commands/    # 命令
│   │   ├── queries/     # 查詢
│   │   └── dtos/        # 數據傳輸對象（DTOs）
│   └── other/           # 其他系統的應用服務（例如，支付系統等）
│       ├── services/    # 應用服務
│       ├── commands/    # 命令
│       ├── queries/     # 查詢
│       └── dtos/        # 數據傳輸對象（DTOs）
│
├── infrastructure/      # 基礎設施層
│   ├── liff/            # LIFF 系統的基礎設施層
│   │   ├── repositories/# 倉儲實現
│   │   ├── databases/   # 數據庫相關操作（如 ORM、SQL 等）
│   │   ├── messaging/   # 消息隊列、事件總線等
│   │   ├── services/    # 第三方服務接口
│   │   └── utilities/   # 工具類或共享功能
│   ├── lineBot/         # LINE Bot 系統的基礎設施層
│   │   ├── repositories/# 倉儲實現
│   │   ├── databases/   # 數據庫相關操作（如 ORM、SQL 等）
│   │   ├── messaging/   # 消息隊列、事件總線等
│   │   ├── services/    # 第三方服務接口
│   │   └── utilities/   # 工具類或共享功能
│   └── other/           # 其他系統的基礎設施層
│       ├── repositories/# 倉儲實現
│       ├── databases/   # 數據庫相關操作（如 ORM、SQL 等）
│       ├── messaging/   # 消息隊列、事件總線等
│       ├── services/    # 第三方服務接口
│       └── utilities/   # 工具類或共享功能
│
├── interfaces/          # 表現層（UI 層/API 層）
│   ├── liff/            # LIFF 系統的表現層
│   │   ├── controllers/ # 控制器（API 或 Web）
│   │   ├── views/       # 視圖（前端頁面、UI 組件）
│   │   └── dtos/        # 展示層的數據傳輸對象
│   ├── lineBot/         # LINE Bot 系統的表現層
│   │   ├── controllers/ # 控制器（API 或 Web）
│   │   ├── views/       # 視圖（前端頁面、UI 組件）
│   │   └── dtos/        # 展示層的數據傳輸對象
│   └── other/           # 其他系統的表現層
│       ├── controllers/ # 控制器（API 或 Web）
│       ├── views/       # 視圖（前端頁面、UI 組件）
│       └── dtos/        # 展示層的數據傳輸對象
│
├── shared/              # 共享模塊
│   ├── exceptions/      # 異常處理
│   ├── validators/      # 校驗器
│   ├── utils/           # 通用工具類
│   └── constants/       # 常量
│
└── app/                 # 應用層
    ├── client/          # 客戶端相關資源
    ├── admin/           # 管理員後台資源

---

## 開發指南

### 1. **服務端與客戶端分離**
   - 使用 `"use client"` 和 `"use server"` 明確代碼執行環境。
   - 客戶端專注 UI 和狀態管理，服務端處理業務邏輯與數據。
   - 通過 API 層或 Service 層進行通信，避免跨層調用。

### 2. **遵循依賴方向**
   - **Domain 層** 是核心，不依賴其他層。
   - **Infrastructure 層** 的實現應遵守依賴反轉原則，依賴於 `domain/repositories` 定義的接口。
   - **Application 層** 協調領域層的邏輯執行。
   - **Presentation 層** 依賴應用層服務。

### 3. **關注點與職責分離**
   - 客戶端：用戶界面與交互。
   - 服務端：數據處理與業務邏輯。

### 4. **數據流與交互**
   - **控制器 (Controllers)** 處理請求，調用應用層服務。
   - **應用層 (Application)** 負責協調領域層的邏輯執行。
   - **領域層 (Domain)** 專注於業務邏輯，通過接口與基礎設施進行交互。
   - **基礎設施 (Infrastructure)** 提供數據庫或外部服務的實現。

### 5. **測試**
   - **單元測試**：對 `domain` 層進行測試，驗證業務邏輯的正確性。
   - **集成測試**：對 `application` 層和 `infrastructure` 層進行測試，驗證系統整合的正確性。

### 6. **命名規範**
   - 文件名使用駝峰（camelCase）或短橫線（kebab-case）。
   - 變量與函數名應遵循清晰的業務語義。

### 7. **代碼風格**
   - 使用 ESLint 和 Prettier 保持代碼統一性。
   - 嚴格遵循依賴方向，避免跨層直接交互。

### 8. **提交規範**
   - 使用 [Conventional Commits](https://www.conventionalcommits.org/) 規範提交信息。

---

## 代碼示例

### 服務端與客戶端分離示例

**客戶端代碼**
```typescript
"use client";
import { useState } from "react";

const ClientComponent = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const res = await fetch('/api/data');
    setData(await res.json());
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      <div>{data}</div>
    </div>
  );
};

export default ClientComponent;
```

**服務端代碼**
```typescript
"use server";
import { getDataFromDB } from "@/infrastructure/repositories";

export const fetchData = async () => {
  return await getDataFromDB();
};
```

## 緩存策略使用指南

### Redis vs Memcached vs Edge

**使用 Redis 的情況：**
1. 支持多種數據結構（如字符串、哈希、列表等），適合存儲複雜數據。
   - 示例：社交平台的帖子、評論（哈希），推薦內容（有序集合）。
2. 需要數據持久化，適合重啟後保持數據的應用。
   - 示例：用戶會話狀態存儲。
3. 支持隊列、計數器等複雜操作。
   - 示例：即時遊戲積分榜，消息推送。
4. 高可用性與分區支持，適合分佈式系統。
   - 示例：電子商務平台的會話共享。

**使用 Memcached 的情況：**
1. 高效的鍵值快取，適合簡單數據查詢。
   - 示例：頁面生成結果快取。
2. 快速讀寫場景，適合頻繁操作。
   - 示例：玩家資訊、商品快取。
3. 輕量級存儲，適合低存儲需求。
   - 示例：用戶登錄信息快取。
4. 不需要持久化的簡單快取需求。
   - 示例：短期有效的搜尋結果快取。

**使用 Edge 的情況：**
1. 極低延遲和即時處理。
   - 示例：即時視頻流處理或在線遊戲。
2. 分佈式部署以降低負載。
   - 示例：CDN 加速全球用戶內容交付。
3. 處理大量本地數據。
   - 示例：物聯網設備的本地數據處理。
4. 加速用戶體驗。
   - 示例：電商網站的產品搜尋和推薦算法。

## 常見問題

### 1. 如何新增一個業務用例？

在 DDD 架構中，新增業務用例通常需要：
- 在 Domain 層中定義新的業務邏輯（如新的實體、聚合根等）。
- 在 Application 層中新增用例服務（如命令或查詢）。
- 在 Infrastructure 層中實現數據存取或第三方服務的集成。
- 在 Presentation 層中設計相應的 UI 或 API 端點。

---

Next.js 14 App Router + Server Components