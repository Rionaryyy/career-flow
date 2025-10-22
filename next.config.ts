import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ ESLintで警告やエラーが出てもVercelのビルドを止めない
  eslint: {
    ignoreDuringBuilds: true,
  },

  // （必要なら今後ここに他の設定を追加可能）
};

export default nextConfig;
