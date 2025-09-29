"use client";

import React, { useState, useEffect } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Contract({ answers, onChange }: Props) {
  const [familyLines, setFamilyLines] = useState<string | null>(answers.familyLines || null);
  const [setDiscount, setSetDiscount] = useState<string | null>(answers.setDiscount || null);
  const [infraSet, setInfraSet] = useState<string | null>(answers.infraSet || null);

  useEffect(() => {
    onChange({ familyLines, setDiscount, infraSet });
  }, [familyLines, setDiscount, infraSet, onChange]);

  return (
    <div className="w-full px-2 sm:px-4 py-6 space-y-3">
      <h2 className="text-3xl font-bold text-center text-white mb-4">③ 契約条件・割引について</h2>

      {/* 家族割 */}
      <div className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
        <p className="text-xl font-semibold text-white text-center">1. 家族割引を適用できる回線数は？</p>
        {["1回線","2回線","3回線以上","利用できない / わからない"].map((option) => (
          <button
            key={option}
            onClick={() => setFamilyLines(option)}
            className={`w-full py-3 rounded-lg border transition ${
              familyLines === option
                ? "bg-blue-600 border-blue-400 text-white"
                : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* 光回線セット割 */}
      <div className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
        <p className="text-xl font-semibold text-white text-center">2. 光回線とのセット割は？</p>
        {["はい（契約中または契約予定）","いいえ / わからない"].map((option) => (
          <button
            key={option}
            onClick={() => setSetDiscount(option)}
            className={`w-full py-3 rounded-lg border transition ${
              setDiscount === option
                ? "bg-blue-600 border-blue-400 text-white"
                : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* 電気・ガスセット割 */}
      <div className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
        <p className="text-xl font-semibold text-white text-center">3. 電気・ガスなどのセット割は？</p>
        {["はい（契約中または契約予定）","いいえ / わからない"].map((option) => (
          <button
            key={option}
            onClick={() => setInfraSet(option)}
            className={`w-full py-3 rounded-lg border transition ${
              infraSet === option
                ? "bg-blue-600 border-blue-400 text-white"
                : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
