// app/components/Result.tsx
"use client";

import { DiagnosisAnswers } from "@/types/types";
import { useState } from "react";

interface ResultProps {
  answers: DiagnosisAnswers;
  onRestart: () => void;
}

export default function Result({ answers, onRestart }: ResultProps) {
  const [copied, setCopied] = useState(false);

  // 仮に結果の要約を作る例
  const summary = `キャリア診断結果:
- ポイント還元重視: ${answers.phase1.includePoints ? "はい" : "いいえ"}
- 通信品質重視: ${answers.phase1.networkQuality ? "高い" : "普通"}
- 希望キャリア: ${answers.phase1.carrierType || "未選択"}
`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("コピーに失敗しました:", err);
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">診断結果</h2>

      <div className="bg-white p-4 rounded shadow">
        <pre className="whitespace-pre-wrap">{summary}</pre>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleShare}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          結果をコピー
        </button>
        {copied && <span className="text-green-600 mt-2 sm:mt-0">コピーしました！</span>}

        <button
          onClick={onRestart}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          最初からやり直す
        </button>
      </div>
    </section>
  );
}
