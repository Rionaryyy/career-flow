// app/components/Phase1.tsx
"use client";

import React from "react";
import { DiagnosisAnswers, Phase1Answers } from "@/types/types";

type Phase1Props = {
  answers: DiagnosisAnswers["phase1"];
  setAnswers: (newAnswers: Phase1Answers) => void;
  onNext: () => void;
  onBack?: () => void;
};

const questions = [
  {
    id: "includePoints",
    question: "ポイント還元や経済圏特典も“実質料金”に含めて考えますか？",
    options: [
      "はい（ポイントも含めて最安を知りたい）",
      "いいえ（現金支出だけで比べたい）",
    ],
  },
  {
    id: "networkQuality",
    question: "通信品質（速度・安定性）はどの程度重視しますか？",
    options: [
      "とても重視する（大手キャリア水準が望ましい）",
      "ある程度重視する（格安でも安定していればOK）",
      "こだわらない（コスト最優先）",
    ],
  },
  {
    id: "carrierType",
    question: "キャリアの種類に希望はありますか？",
    options: [
      "大手キャリア（ドコモ / au / ソフトバンク / 楽天）",
      "サブブランド（ahamo / povo / LINEMO / UQなど）もOK",
      "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい",
    ],
  },
  {
    id: "supportPreference",
    question: "契約・サポートはオンライン完結で問題ありませんか？",
    options: ["はい（店舗サポートは不要）", "いいえ（店頭での手続きや相談が必要）"],
  },
  {
    id: "contractLockPreference",
    question: "契約期間の縛りや解約金について、どの程度気にしますか？",
    options: ["絶対に嫌（縛りなしが前提）", "できれば避けたいが内容次第", "気にしない（条件次第でOK）"],
  },
];

export default function Phase1({ answers, setAnswers, onNext, onBack }: Phase1Props) {
  const handleSelect = (id: string, option: string) => {
    setAnswers({
      ...answers,
      [id]: option,
    } as Phase1Answers);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
      <h2 className="text-3xl font-bold text-center text-white mb-4">📍 フェーズ①：前提条件</h2>

      {questions.map((q) => (
        <div
          key={q.id}
          className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 w-[98%] mx-auto transition-all duration-300"
        >
          <p className="text-xl font-semibold mb-4 text-white text-center">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(q.id, option)}
                className={`w-full py-3 rounded-lg border transition ${
                  answers[q.id as keyof typeof answers] === option
                    ? "bg-blue-600 border-blue-400 text-white"
                    : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center pt-6">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-full bg-slate-600 hover:bg-slate-500 text-sm"
            >
              戻る
            </button>
          )}
        </div>
        <div>
          <button
            onClick={onNext}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-lg font-semibold transition-all duration-300 shadow-lg shadow-blue-900/40"
          >
            次へ進む
          </button>
        </div>
      </div>
    </div>
  );
}
