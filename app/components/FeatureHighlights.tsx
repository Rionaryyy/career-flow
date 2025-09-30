export default function FeatureHighlights() {
  const features = [
    {
      title: "端末込みの実質料金診断",
      description:
        "SIMのみ、購入型、返却型まで条件ごとに最適プランを提案。端末代込みで本当のコストが分かります。",
    },
    {
      title: "経済圏・ポイント還元も考慮",
      description:
        "通信費だけでなく、ポイント還元や経済圏の恩恵も含めて比較。見かけの料金ではなく実質負担額で判断できます。",
    },
    {
      title: "あなた専用の最適セット提案",
      description:
        "キャリアだけでなく、今後はサブスク・クレカ・銀行口座まで含めた生活まるごと最適化診断に進化予定。",
    },
  ];

  return (
    <section className="py-16 px-6 max-w-4xl mx-auto">
      <div className="grid gap-10 md:grid-cols-3">
        {features.map((f, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-700">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
