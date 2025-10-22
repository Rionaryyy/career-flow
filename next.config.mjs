/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // 🚫 Turbopackを完全に無効化
  },
  reactStrictMode: true,
};

export default nextConfig;
