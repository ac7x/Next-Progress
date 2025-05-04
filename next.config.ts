import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'profile.line-scdn.net'],
  },
};

// --- 自動 fallback 機制 ---
// 僅當 NEXT_PUBLIC_LIFF_ID 為 undefined（未設置）時，才自動使用 LINE_LIFF_ID
if (typeof process.env.NEXT_PUBLIC_LIFF_ID === 'undefined' && typeof process.env.LINE_LIFF_ID === 'string') {
  process.env.NEXT_PUBLIC_LIFF_ID = process.env.LINE_LIFF_ID;
  // console.log('[next.config.ts] NEXT_PUBLIC_LIFF_ID fallback to LINE_LIFF_ID:', process.env.NEXT_PUBLIC_LIFF_ID);
}

export default nextConfig;