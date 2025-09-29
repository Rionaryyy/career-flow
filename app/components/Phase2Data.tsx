"use client";

import React, { useState, useEffect } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Data({ answers, onChange }: Props) {
  const [dataUsage, setDataUsage] = useState<string | null>(answers.dataUsage || null);
  const [speedLimitImportance, setSpeedLimitImportance] = useState<string | null>(answers.speedLimitImportance || null);
  const [tetheringNeeded, setTetheringNeeded] = useState<string | null>(answers.tetheringNeeded || null);
  const [tetheringUsage, setTetheringUsage] = useState<string | null>(answers.tetheringUsage || null);

  // 選択変更時に親に即反映
  useEffect(() => {
    onChange({ dataUsage, speedLimitImportance, tetheringNeeded, tetheringUsage });
  }, [dataUsage, speedLimitImportance, tetheringNeeded, tetheringUsage, onChange]);

  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">① データ通信に関する質問</h2>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
        <p className="text-xl font-semibold text-white text-center">1. 毎月のデータ利用量は？</p>
        {["～5GB","5GB～20GB","20GB以上","無制限が理想"].map((option) => (
          <button
            key={option}
            onClick={() => setDataUsage(option)}
            className={`w-full py-3 rounded-lg border transition ${
              dataUsage === option ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
        <p className="text-xl font-semibold text-white text-center">2. 速度制限後の速度の重要性は？</p>
        {["あまり気にしない","ある程度重要","非常に重要"].map((option) => (
          <button
            key={option}
            onClick={() => setSpeedLimitImportance(option)}
            className={`w-full py-3 rounded-lg border transition ${
              speedLimitImportance === option ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
        <p className="text-xl font-semibold text-white text-center">3. テザリング機能は必要？</p>
        {["不要","必要"].map((option) => (
          <button
            key={option}
            onClick={() => setTetheringNeeded(option)}
            className={`w-full py-3 rounded-lg border transition ${
              tetheringNeeded === option ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {tetheringNeeded === "必要" && (
        <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
          <p className="text-xl font-semibold text-white text-center">4. テザリングの主な用途は？</p>
          {["PC作業","タブレット","その他"].map((option) => (
            <button
              key={option}
              onClick={() => setTetheringUsage(option)}
              className={`w-full py-3 rounded-lg border transition ${
                tetheringUsage === option ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
