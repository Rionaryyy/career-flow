"use client";

import { useState } from "react";
import Phase1 from "./components/Phase1";
import { DiagnosisAnswers } from "@/types/types";

export default function HomePage() {
  const [started, setStarted] = useState(false);

  // フェーズ①の回答状態
  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    includePoints: "",
    qualityPriority: "",
    carrierType: "",
    supportPreference: "",
    contractLockPreference: "",
  });

  // 「次へ進む」ボタン押下時（今は仮処理）
  const handleNext = () => {
    console.log("フェーズ①の回答:", answers);
    // TODO: フェーズ②へ遷移 or 結果画面へ進む処理をここに追加
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      {!started ? (
        // 🏠 スタート画面
        <div className="max-w-md w-full bg-slate-800 border border-slate-600 shadow-lg rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            キャリア診断
          </h1>
          <p className="text-gray-300 mb-8 leading-relaxed">
            数問に答えるだけで、あなたに最適な携帯キャリア・プランを見つけます！
          </p>
          <button
            onClick={() => setStarted(true)}
            className="inline-block bg-blue-600 text-white text-lg font-semibold py-3 px-8 rounded-full shadow hover:bg-blue-700 transition-colors"
          >
            診断を始める
          </button>
        </div>
      ) : (
        // 📍 フェーズ①の質問画面
        <Phase1 answers={answers} setAnswers={setAnswers} onNext={handleNext} />
      )}
    </main>
  );
}
