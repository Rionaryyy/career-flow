"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  onComplete: (answers: Phase2Answers) => void;
}

export default function Phase2({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Phase2Answers>({
    ecosystemUsage: null,
    monthlyData: null,
    callFrequency: null,
    familyDiscount: null,
  });

  const handleChange = <K extends keyof Phase2Answers>(
    key: K,
    value: Phase2Answers[K]
  ) => {
    setAnswers((prev: Phase2Answers) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">フェーズ②：詳細条件の確認</h2>

      <div>
        <p>経済圏の利用度は？</p>
        <button onClick={() => handleChange("ecosystemUsage", "none")}>
          ほとんど使わない
        </button>
        <button onClick={() => handleChange("ecosystemUsage", "light")}>
          そこそこ使う
        </button>
        <button onClick={() => handleChange("ecosystemUsage", "heavy")}>
          がっつり使う
        </button>
      </div>

      {/* 他の質問も同様に handleChange を使って追加 */}

      <button
        onClick={() => onComplete(answers)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        診断結果を見る
      </button>
    </div>
  );
}
