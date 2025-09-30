"use client";

import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="bg-blue-600 text-white py-20 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">あなたに最適なキャリア診断</h1>
      <p className="text-lg mb-8">
        通信料金 × 端末購入 × 経済圏ポイントまで踏み込んだ、本当の実質コストを診断
      </p>
      <button
        onClick={() => router.push("/diagnosis-flow")}
        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
      >
        診断を始める
      </button>
    </section>
  );
}
