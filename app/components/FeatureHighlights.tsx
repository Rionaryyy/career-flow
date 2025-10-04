"use client";

import { Zap, TrendingUp, Smartphone } from "lucide-react";

export default function FeatureHighlights() {
  const features = [
    {
      icon: <Smartphone className="w-8 sm:w-10 h-8 sm:h-10 text-blue-500 mb-4" />,
      title: "端末込みの実質料金診断",
      description:
        "SIMのみ、購入型、返却型まで条件ごとに最適プランを提案。端末代込みで本当のコストが分かります。",
    },
    {
      icon: <TrendingUp className="w-8 sm:w-10 h-8 sm:h-10 text-blue-500 mb-4" />,
      title: "経済圏・ポイント還元も考慮",
      description:
        "通信費だけでなく、ポイント還元や経済圏の恩恵も含めて比較。見かけの料金ではなく実質負担額で判断できます。",
    },
    {
      icon: <Zap className="w-8 sm:w-10 h-8 sm:h-10 text-blue-500 mb-4" />,
      title: "あなた専用の最適セット提案",
      description:
        "キャリアだけでなく、今後はサブスク・クレカ・銀行口座まで含めた生活まるごと最適化診断に進化予定。",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
        私たちの診断が選ばれる
        <span className="text-blue-500">3つの理由</span>
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-4 sm:px-6">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 text-center"
          >
            {f.icon}
            <h3 className="text-lg sm:text-xl font-semibold mb-3">{f.title}</h3>
            <p className="text-gray-600 text-base leading-relaxed break-words">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
