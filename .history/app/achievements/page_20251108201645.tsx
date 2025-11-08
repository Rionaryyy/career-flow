"use client";

import Header from "../components/layouts/Header";
import FeatureHighlightsFlow from ".././components/FeatureHighlightsFlow";
import HeroMini from ".././components/HeroMini";

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-black w-full">
      <Header />
      <main className="w-full pt-16 space-y-12">
        {/* HeroMini */}
        <HeroMini />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">実績</h1>
          <p className="text-gray-700 leading-relaxed mb-4">
            当サービスはすでに多くのユーザーにご利用いただいています。
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>累計診断ユーザー数: 10,000人以上</li>
            <li>最適なキャリアプラン提案率: 95%</li>
            <li>ユーザー満足度: ★★★★☆</li>
          </ul>
        </section>

        <FeatureHighlightsFlow />
      </main>
    </div>
  );
}
