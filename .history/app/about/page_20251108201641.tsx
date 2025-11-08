"use client";

import Header from "../components/DiagnosisFlow/Header";
import FeatureHighlightsFlow from ".././components/FeatureHighlightsFlow";
import HeroMini from ".././components/HeroMini";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-black w-full">
      <Header />
      <main className="w-full pt-16 space-y-12">
        {/* HeroMini */}
        <HeroMini />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">概要</h1>
          <p className="text-gray-700 leading-relaxed mb-4">
            通信キャリア診断サービス「Career Flow」は、あなたに最適なキャリア・プランを提案します。
          </p>
          <p className="text-gray-700 leading-relaxed">
            通信料金、端末購入、経済圏ポイントまで踏み込み、本当の「実質コスト」を診断することで、毎月の支出を最適化します。
          </p>
        </section>

        <FeatureHighlightsFlow />
      </main>
    </div>
  );
}
