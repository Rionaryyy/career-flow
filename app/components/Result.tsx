"use client";

import { DiagnosisAnswers } from "@/types/types";

type Props = {
  answers: DiagnosisAnswers;
  onRestart: () => void;
};

export default function Result({ answers, onRestart }: Props) {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <h2 className="text-3xl font-bold">診断結果</h2>

      <div className="bg-white shadow-md rounded-xl p-6 text-left space-y-4">
        <h3 className="text-xl font-semibold">基本条件</h3>
        <ul className="list-disc ml-6">
          <li>ポイント重視: {answers.phase1.considerPoints ? "はい" : "いいえ"}</li>
          <li>通信品質: {answers.phase1.networkQuality}</li>
          <li>希望キャリア: {answers.phase1.carrierType}</li>
          <li>サポート重視: {answers.phase1.supportPriority}</li>
          <li>契約縛りなし: {answers.phase1.contractFreedom ? "はい" : "いいえ"}</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">利用状況</h3>
        <ul className="list-disc ml-6">
          <li>経済圏利用: {answers.phase2.ecosystemUsage}</li>
          <li>月間データ量: {answers.phase2.monthlyData} GB</li>
          <li>通話頻度: {answers.phase2.callFrequency}</li>
          <li>家族割利用: {answers.phase2.familyDiscount ? "はい" : "いいえ"}</li>
        </ul>
      </div>

      <button
        onClick={onRestart}
        className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition"
      >
        もう一度診断する
      </button>
    </div>
  );
}
