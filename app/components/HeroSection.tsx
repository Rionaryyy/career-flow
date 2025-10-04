"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center text-white min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/hero-bg.jpg')",
      }}
    >
      {/* オーバーレイ効果 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>

      <motion.div
        className="relative z-10 max-w-3xl px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          あなたに最適な<br />
          <span className="text-blue-400">キャリア診断</span>
        </h1>

        <p className="text-lg md:text-xl mb-10 text-gray-200">
          通信料金 × 端末購入 × 経済圏ポイントまで踏み込んだ、<br />
          本当の「実質コスト」を診断
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/diagnosis-flow")}
          className="bg-blue-500 text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          診断を始める
        </motion.button>
      </motion.div>

      {/* 下向き矢印 */}
      <div className="absolute bottom-6 animate-bounce text-white text-2xl">↓</div>
    </section>
  );
}
