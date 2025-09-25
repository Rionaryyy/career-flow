"use client";
import { DiagnosisAnswers } from "../types/types";

interface ResultProps {
  answers: DiagnosisAnswers;
  restart: () => void;
}

export default function Result({ answers, restart }: ResultProps) {
  const recommendCarrier = () => {
    if (answers.carrierType === "major") return "ドコモ / au / ソフトバンク";
    if (answers.carrierType === "sub") return "ahamo / povo / LINEMO";
    return "IIJmio / mineo / HISモバイル";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">あなたへのおすすめ</h2>
      <div className="bg-gray-800 p-6 rounded-lg space-y-2">
        <p>📱 キャリアの種類: {recommendCarrier()}</p>
        <p>💡 ポイント重視: {answers.includePoints === "yes" ? "はい" : "いいえ"}</p>
        <p>📶 通信品質: {answers.qualityPriority}</p>
        <p>📦 経済圏利用: {answers.ecosystemUse}</p>
        <p>📊 データ使用量: {answers.dataUsage}</p>
        <p>📞 通話頻度: {answers.callFrequency}</p>
      </div>
      <button
        onClick={restart}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        もう一度診断する
      </button>
    </div>
  );
}
