"use client";

import { DiagnosisAnswers } from "@/types/types";

interface ResultProps {
  answers: DiagnosisAnswers;
  onRestart: () => void;
}

export default function Result({ answers, onRestart }: ResultProps) {
  const { phase1, phase2 } = answers;

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-6">診断結果</h2>

      <div className="bg-gray-100 p-4 rounded-xl mb-8 text-left space-y-2">
        <p>📊 通信品質重視度: {phase1.networkQuality ?? "未選択"}</p>
        <p>📡 キャリアタイプ: {phase1.carrierType ?? "未選択"}</p>
        <p>💰 ポイント還元考慮: {phase1.includePoints ? "する" : "しない"}</p>
        <p>🤝 サポート重視度: {phase1.supportLevel ?? "未選択"}</p>
        <p>🔁 契約縛り: {phase1.contractFlexibility ?? "未選択"}</p>
        <p>🏦 経済圏利用: {phase2.ecosystemUsage ?? "未選択"}</p>
        <p>📶 データ量: {phase2.monthlyData ?? "未入力"} GB/月</p>
      </div>

      <button
        onClick={onRestart}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        もう一度診断する
      </button>
    </div>
  );
}
