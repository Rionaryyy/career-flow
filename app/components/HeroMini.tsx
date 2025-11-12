"use client";
import { motion } from "framer-motion";

export default function HeroMini() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center text-white h-[20vh] sm:h-[25vh] md:h-[30vh] bg-cover bg-center px-4 sm:px-6"
      style={{
        // yellow-300 (#fde047) を少し濃く（0.5）
        backgroundImage:
          "linear-gradient(rgba(253,224,71,0.2), rgba(253,224,71,0.2)), url('/images/tech-bg.jpg')",
      }}
    >
      <motion.div
        className="relative z-10 max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3 text-orange-400">
          あなたに最適な<br />
          <span className="text-orange-600">通信キャリア診断</span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-orange-400 leading-relaxed">
          通信料金 × 端末購入 × 経済圏ポイントまで踏み込んだ、<br />
          本当の「実質コスト」を診断
        </p>
      </motion.div>
    </section>
  );
}
