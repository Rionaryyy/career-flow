"use client";

import { DiagnosisAnswers } from "@/types/types";

interface ResultProps {
  answers: DiagnosisAnswers;
}

export default function Result({ answers }: ResultProps) {
  const { phase1, phase2 } = answers;

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">診断結果</h2>
      <div className="space-y-2">
        <p>💰 ポイント還元を含める: {phase1.includePoints ? "はい" : "いいえ"}</p>
        <p>📶 通信品質: {phase1.networkQuality}</p>
        <p>📡 キャリア種別: {phase1.carrierType}</p>
        <p>💁‍♂️ サポート重視度: {phase1.supportLevel}</p>
        <p>🔁 契約縛り: {phase1.contractFlexibility}</p>
        <p>🏦 経済圏の利用状況: {phase2.ecosystemUsage}</p>
        <p>📊 毎月のデータ量: {phase2.monthlyData} GB</p>
      </div>
    </div>
  );
}
