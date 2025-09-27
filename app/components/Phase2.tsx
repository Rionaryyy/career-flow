"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Phase2Props {
  onSubmit: (answers: Phase2Answers) => void;
  onBack?: () => void;
}

export default function Phase2({ onSubmit, onBack }: Phase2Props) {
  const [ecosystemUsage, setEcosystemUsage] = useState<"none" | "light" | "heavy" | null>(null);
  const [monthlyData, setMonthlyData] = useState<number | null>(null);

  const handleSubmit = () => {
    const answers: Phase2Answers = {
      ecosystemUsage,
      monthlyData,
    };
    onSubmit(answers);
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-slate-50">
      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">フェーズ②：詳細条件</h2>

        <div className="mb-6">
          <p className="font-semibold mb-2">経済圏の利用状況</p>
          <div className="flex gap-3">
            <button onClick={() => setEcosystemUsage("none")} className={`px-4 py-2 rounded ${ecosystemUsage === "none" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>ほぼ利用しない</button>
            <button onClick={() => setEcosystemUsage("light")} className={`px-4 py-2 rounded ${ecosystemUsage === "light" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>ときどき利用</button>
            <button onClick={() => setEcosystemUsage("heavy")} className={`px-4 py-2 rounded ${ecosystemUsage === "heavy" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>よく利用する</button>
          </div>
        </div>

        <div className="mb-8">
          <p className="font-semibold mb-2">1ヶ月のデータ通信量（GB）</p>
          <input
            type="number"
            min={0}
            placeholder="例: 20"
            className="w-full border rounded px-4 py-2"
            value={monthlyData ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setMonthlyData(v === "" ? null : Number(v));
            }}
          />
        </div>

        <div className="flex justify-between">
          {onBack ? (
            <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">戻る</button>
          ) : <div />}

          <button onClick={handleSubmit} className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
            結果を見る
          </button>
        </div>
      </div>
    </div>
  );
}
