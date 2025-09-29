"use client";

import React, { useState, useEffect } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Call({ answers, onChange }: Props) {
  const [callFrequency, setCallFrequency] = useState<string | null>(answers.callFrequency || null);
  const [callPriority, setCallPriority] = useState<string | null>(answers.callPriority || null);
  const [callOptionsNeeded, setCallOptionsNeeded] = useState<string | null>(answers.callOptionsNeeded || null);
  const [callPurpose, setCallPurpose] = useState<string | null>(answers.callPurpose || null);

  // 選択が変わったら即反映
  useEffect(() => {
    onChange({ callFrequency, callPriority, callOptionsNeeded, callPurpose });
  }, [callFrequency, callPriority, callOptionsNeeded, callPurpose, onChange]);

  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-white mb-6">② 通話に関する質問</h2>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
        <p className="text-xl font-semibold text-white text-center">1. 通話の頻度はどのくらいですか？</p>
        {["ほとんどしない","時々する（月数回）","よくする（週数回〜毎日）"].map((option) => (
          <button
            key={option}
            onClick={() => setCallFrequency(option)}
            className={`w-full py-3 rounded-lg border transition ${
              callFrequency === option ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
        <p className="text-xl font-semibold text-white text-center">2. 通話品質の重視度は？</p>
        {["あまり重視しない","ある程度重視","非常に重視"].map((option) => (
          <button
            key={option}
            onClick={() => setCallPriority(option)}
            className={`w-full py-3 rounded-lg border transition ${
              callPriority === option ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
        <p className="text-xl font-semibold text-white text-center">3. 通話オプション（かけ放題など）は必要？</p>
        {["特に不要","5分〜10分かけ放題","無制限かけ放題"].map((option) => (
          <button
            key={option}
            onClick={() => setCallOptionsNeeded(option)}
            className={`w-full py-3 rounded-lg border transition ${
              callOptionsNeeded === option ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
        <p className="text-xl font-semibold text-white text-center">4. 主な通話の目的は？</p>
        {["プライベート","仕事","両方"].map((option) => (
          <button
            key={option}
            onClick={() => setCallPurpose(option)}
            className={`w-full py-3 rounded-lg border transition ${
              callPurpose === option ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
