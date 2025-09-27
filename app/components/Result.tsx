"use client";

import { DiagnosisAnswers } from "@/types/types";

interface ResultProps {
  answers: DiagnosisAnswers;
  onRestart?: () => void;
}

export default function Result({ answers, onRestart }: ResultProps) {
  const { phase1, phase2 } = answers;

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold">診断結果</h2>

      <div className="space-y-2 text-lg">
        <p>💰 ポイント還元を含める: {phase1.includePoints ? "はい" : "いいえ"}</p>
        <p>📶 通信品質の重視度: {phase1.networkQuality}</p>
        <p>📡 希望キャリア種別: {phase1.carrierType}</p>
        <p>💁‍♂️ サポート重視度: {phase1.supportLevel}</p>
        <p>🔁 契約縛りの有無: {phase1.contractFlexibility}</p>

        <p>🏦 経済圏の利用状況: {phase2.ecosystemUsage}</p>
        <p>📊 毎月のデータ量: {phase2.monthlyData} GB</p>
      </div>

      {onRestart && (
        <button
          onClick={onRestart}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          もう一度診断する
        </button>
