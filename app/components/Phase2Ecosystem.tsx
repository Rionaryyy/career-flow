"use client";

import React, { useState, useEffect } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Ecosystem({ answers, onChange }: Props) {
  const [ecosystem, setEcosystem] = useState<string | null>(answers.ecosystem || null);
  const [ecosystemMonthly, setEcosystemMonthly] = useState<string | null>(answers.ecosystemMonthly || null);

  const optionsMonthly = ["〜5,000円", "5,000〜10,000円", "10,000〜30,000円", "30,000円以上"];

  useEffect(() => {
    onChange({ ecosystem, ecosystemMonthly });
  }, [ecosystem, ecosystemMonthly, onChange]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">
        ④ 経済圏・ポイント利用状況
      </h2>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
        <p className="text-xl font-semibold text-white text-center">
          1. よく利用しているポイント経済圏は？
        </p>
        {[
          "楽天経済圏（楽天カード・楽天市場など）",
          "dポイント（ドコモ・dカードなど）",
          "PayPay / ソフトバンク経済圏",
          "au PAY / Ponta経済圏",
          "特になし",
        ].map((option) => (
          <button
            key={option}
            onClick={() => setEcosystem(option)}
            className={`w-full py-3 rounded-lg border transition ${
              ecosystem === option
                ? "bg-blue-600 border-blue-400 text-white"
                : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {ecosystem && ecosystem !== "特になし" && (
        <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 space-y-4">
          <p className="text-xl font-semibold text-white text-center">2. 月間利用額は？</p>
          {optionsMonthly.map((option) => (
            <button
              key={option}
              onClick={() => setEcosystemMonthly(option)}
              className={`w-full py-3 rounded-lg border transition ${
                ecosystemMonthly === option
                  ? "bg-blue-600 border-blue-400 text-white"
                  : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
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
