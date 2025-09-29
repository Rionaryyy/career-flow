"use client";

import React, { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Contract({ answers, onChange }: Props) {
  const [familyLines, setFamilyLines] = useState<string | null>(answers.familyLines || null);
  const [setDiscount, setSetDiscount] = useState<string | null>(answers.setDiscount || null);
  const [infraSet, setInfraSet] = useState<string | null>(answers.infraSet || null);

  const handleNext = () => {
    onChange({ familyLines, setDiscount, infraSet });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">③ 契約条件・割引について</h2>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
        <p className="text-xl font-semibold text-white text-center">1. 家族割引を適用できる回線数は？</p>
        {["1回線","2回線","3回線以上","利用できない / わからない"].map((option) => (
          <button
            key={option}
            onClick={() => setFamilyLines(option)}
            className={`w-full py-3 rounded-lg border transition ${
              familyLines === option ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
        <p className="text-xl font-semibold text-white text-center">2. 光回線とのセット割は？</p>
        {["はい（契約中または契約予定）","いいえ / わからない"].map((option) => (
          <button
            key={option}
            onClick={() => setSetDiscount(option)}
            className={`w-full py-3 rounded-lg border transition ${
              setDiscount === option ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
        <p className="text-xl font-semibold text-white text-center">3. 電気・ガスなどのセット割は？</p>
        {["はい（契約中または契約予定）","いいえ / わからない"].map((option) => (
          <button
            key={option}
            onClick={() => setInfraSet(option)}
            className={`w-full py-3 rounded-lg border transition ${
              infraSet === option ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          disabled={!familyLines || !setDiscount || !infraSet}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-lg font-semibold transition-all duration-300 shadow-lg shadow-blue-900/40 disabled:opacity-50"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
