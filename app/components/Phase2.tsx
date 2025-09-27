"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Phase2Props {
  onSubmit: (answers: Phase2Answers) => void;
}

export default function Phase2({ onSubmit }: Phase2Props) {
  const [answers, setAnswers] = useState<Phase2Answers>({
    monthlyData: 0,
    callFrequency: "medium",
    familyDiscount: "no",
    setDiscount: "no",
    useEcosystem: "no",
  });

  const handleChange = <K extends keyof Phase2Answers>(key: K, value: Phase2Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">フェーズ②（詳細条件）</h2>

      {/* 進捗バー */}
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: "50%" }}></div>
      </div>

      {/* Q1 */}
      <div>
        <label className="block font-medium mb-2">月間データ使用量（GB）を選んでください</label>
        <input
          type="number"
          min={0}
          value={answers.monthlyData}
          onChange={(e) => handleChange("monthlyData", Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Q2 */}
      <div>
        <label className="block font-medium mb-2">通話頻度を教えてください</label>
        <select
          value={answers.callFrequency}
          onChange={(e) =>
            handleChange("callFrequency", e.target.value as "low" | "medium" | "high")
          }
          className="w-full p-2 border rounded"
        >
          <option value="low">少ない</option>
          <option value="medium">普通</option>
          <option value="high">多い</option>
        </select>
      </div>

      {/* Q3 */}
      <div>
        <label className="block font-medium mb-2">家族割を利用しますか？</label>
        <select
          value={answers.familyDiscount}
          onChange={(e) => handleChange("familyDiscount", e.target.value as "yes" | "no")}
          className="w-full p-2 border rounded"
        >
          <option value="yes">はい</option>
          <option value="no">いいえ</option>
        </select>
      </div>

      {/* Q4 */}
      <div>
        <label className="block font-medium mb-2">セット割（光回線など）を利用しますか？</label>
        <select
          value={answers.setDiscount}
          onChange={(e) => handleChange("setDiscount", e.target.value as "yes" | "no")}
          className="w-full p-2 border rounded"
        >
          <option value="yes">はい</option>
          <option value="no">いいえ</option>
        </select>
      </div>

      {/* Q5 */}
      <div>
        <label className="block font-medium mb-2">経済圏サービス（ポイント還元など）を利用しますか？</label>
        <select
          value={answers.useEcosystem}
          onChange={(e) => handleChange("useEcosystem", e.target.value as "yes" | "no")}
          className="w-full p-2 border rounded"
        >
          <option value="yes">はい</option>
          <option value="no">いいえ</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        診断結果を見る
      </button>
    </div>
  );
}
