"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center text-white min-h-screen bg-cover bg-center px-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/tech-bg.jpg')",
      }}
    >
      {/* メインコンテンツ */}
      <motion.div
        className="relative z-10 max-w-2xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          あなたに最適な<br />
          <span className="text-blue-400">通信キャリア診断</span>
        </h1>

        <p className="text-base md:text-lg mb-10 text-gray-200 leading-relaxed break-words w-full">
  通信料金 × 端末購入 × 経済圏ポイントまで踏み込んだ、本当の「実質コスト」を診断
</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/diagnosis-flow")}
          className="w-4/5 sm:w-auto bg-blue-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-blue-600 transition text-lg"
        >
          診断を始める
        </motion.button>
      </motion.div>

      {/* 下スクロール誘導 */}
      <div className="absolute bottom-6 animate-bounce text-white text-2xl">↓</div>
    </section>
  );
}
