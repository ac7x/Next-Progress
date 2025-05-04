# 使用官方 Node.js LTS 版本
FROM node:20-slim

# 設定工作目錄
WORKDIR /app

# 複製 package 定義並安裝依賴（利用快取）
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  else npm ci; fi

# 複製專案檔案
COPY . .

# 構建 Next.js 專案
RUN npm run build

# 設定 Cloud Run 預設 port
ENV PORT=8080

# Next.js production server 預設監聽 0.0.0.0
EXPOSE 8080

# 啟動 Next.js production server
CMD ["npm", "start"]
