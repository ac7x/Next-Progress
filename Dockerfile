# 使用官方 Node.js LTS 版本
FROM node:20-slim

WORKDIR /app

# 僅複製必要檔案以利用快取
COPY package.json package-lock.json ./

# 安裝所有依賴（包括 devDependencies）
RUN npm ci

# 複製專案檔案
COPY . .

# 構建 Next.js 專案
RUN npm run build

# 設定 Cloud Run 預設 port
ENV PORT=8080

EXPOSE 8080

# 啟動 Next.js production server
CMD ["npm", "start"]
