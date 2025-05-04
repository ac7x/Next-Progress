# 使用官方 Node.js LTS 版本
FROM node:20-slim

WORKDIR /app

# 僅複製必要檔案以利用快取
COPY package.json package-lock.json ./
COPY public ./public
COPY src ./src
COPY prisma ./prisma
COPY next.config.js tsconfig.json ./

# 安裝所有依賴（包括 devDependencies）
RUN npm ci

# 構建 Next.js 專案
RUN npm run build

# 設定為 production，以利優化建置與執行
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# 啟動 Next.js production server，並使用 Cloud Run 提供的 $PORT
CMD ["npx","next","start","-p","${PORT}"]
