// components/FeatureHighlightsFlow.tsx
"use client";

import React from "react";

export default function FeatureHighlightsFlow() {
  const features = [
    {
      title: "あなたに最適な提案",
      description: "回答内容に基づき、最適なキャリア・プランを提案します。",
    },
    {
      title: "簡単操作で診断完了",
      description: "数分で完了。複雑な入力は不要です。",
    },
    {
      title: "比較しやすい一覧表示",
      description: "複数プランを並べて、違いを直感的に確認できます。",
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-12 px-4 sm:px-6 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-10">
          診断後のポイント
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:scale-[1.03]"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTAボタン */}
        <a
          href="#result"
          className="inline-block px-8 py-4 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-md transition"
        >
          診断結果を見る
        </a>
      </div>
    </section>
  );
}
