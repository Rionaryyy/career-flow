"use client";

import HeroSection from "./components/HeroSection";
import FeatureHighlights from "./components/FeatureHighlights";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヒーローセクション */}
      <HeroSection />

      {/* サービス特徴の3つの強み */}
      <FeatureHighlights />
    </main>
  );
}
