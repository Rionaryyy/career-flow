"use client";

import FeatureHighlightsFlow from ".././components/FeatureHighlightsFlow";

export default function AchievementsPage() {
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
          実績
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl">
          当サービスの実績やユーザーの声をご紹介します。
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-20 py-16 text-left">
        <p className="text-gray-800">
          多くのユーザーが本サービスで最適なキャリアを見つけ、
          実際の契約にも役立てています。
        </p>
      </section>

      <FeatureHighlightsFlow />
    </main>
  );
}
