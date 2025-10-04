"use client";

import HeroSection from "./components/HeroSection";
import FeatureHighlights from "./components/FeatureHighlights";

export default function HomePage() {
  return (
    <main className="bg-gradient-to-b from-white to-gray-50 w-full">
      {/* ヒーローセクション */}
      <HeroSection />

      {/* サービス特徴の3つの強み */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeatureHighlights />
      </section>
    </main>
  );
}
