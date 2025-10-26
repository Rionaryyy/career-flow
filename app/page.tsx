//dev判断用

"use client";

import HeroSection from "./components/HeroSection";
import FeatureHighlights from "./components/FeatureHighlights";

export default function HomePage() {
  return (
    <main className="bg-gradient-to-b from-white to-gray-50">
      {/* ヒーローセクション */}
      <HeroSection />

      {/* サービス特徴の3つの強み */}
      <FeatureHighlights />
    </main>
  );
}
