"use client";

import Header from "../components/layouts/Header";
import FeatureHighlightsFlow from "../components/FeatureHighlightsFlow";
import HeroMini from "../components/HeroMini";

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-black w-full">
      <Header />
      <main className="w-full pt-16 space-y-12">
        {/* HeroMini */}
        <HeroMini />

        {/* 実績セクション */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-sky-900">実績</h1>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
            当サービスはすでに多くのユーザーにご利用いただいています。
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>累計診断ユーザー数: 10,000人以上</li>
            <li>最適なキャリアプラン提案率: 95%</li>
            <li>ユーザー満足度: ★★★★☆</li>
          </ul>
        </section>

        {/* フッター・特徴セクション */}
        <FeatureHighlightsFlow />
      </main>
    </div>
  );
}
