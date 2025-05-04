import type { NextConfig } from "next";

// --- 環境變數偵錯輸出 ---
console.log('[next.config.ts] DATABASE_URL:', process.env.DATABASE_URL ?? '(undefined)');
console.log('[next.config.ts] NEXT_PUBLIC_LIFF_ID:', process.env.NEXT_PUBLIC_LIFF_ID ?? '(undefined)');

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'profile.line-scdn.net'],
  },
};

export default nextConfig;