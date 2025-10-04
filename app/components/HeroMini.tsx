// app/components/HeroMini.tsx
"use client";
import { motion } from "framer-motion";

export default function HeroMini() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center text-white min-h-[60vh] bg-cover bg-center px-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/tech-bg.jpg')",
      }}
    >
      <motion.div
        className="relative z-10 max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          あなたに最適なキャリア診断
        </h2>
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          通信料金 × 端末購入 × 経済圏ポイントまで踏み込んだ、本当の「実質コスト」を診断
        </p>
      </motion.div>
    </section>
  );
}
