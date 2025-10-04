"use client";

import FeatureHighlightsFlow from ".././components/FeatureHighlightsFlow";

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-gray-50">
      <section
        className="relative flex flex-col items-center justify-center text-center text-white h-[50vh] bg-cover bg-center px-4 sm:px-6"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/images/tech-bg.jpg')",
        }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          概要
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl">
          あなたに最適なキャリア診断サービスの概要をご紹介します。
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-20 py-16 text-left">
        <p className="text-gray-800">
          本サービスは通信料金、端末購入、経済圏ポイントまで踏み込んだ
          最適なキャリア・プランを提案します。
        </p>
      </section>

      <FeatureHighlightsFlow />
    </main>
  );
}
