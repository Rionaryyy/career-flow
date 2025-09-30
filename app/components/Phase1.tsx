"use client";

import React from "react";
import { Phase1Answers } from "@/types/types";

export interface Phase1Props {
  defaultValues: Phase1Answers;
  onSubmit: (answers: Phase1Answers) => void;
  onBack?: () => void;
}

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

export default function Phase1({ defaultValues, onSubmit, onBack }: Phase1Props) {
  const [answers, setAnswers] = React.useState<Phase1Answers>(defaultValues);

  const handleSelect = (id: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: option,
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-black mb-3">📍 フェーズ①：前提条件</h2>

      {questions.map((q) => (
        <div key={q.id} className="rounded-xl p-4 bg-gray-100 shadow-md w-full mx-auto transition-all duration-300">
          <p className="text-lg font-semibold mb-2 text-black text-center">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(q.id, option)}
                className={`w-full py-2.5 rounded-lg border transition ${
                  answers[q.id as keyof typeof answers] === option
                    ? "bg-indigo-700 border-indigo-800 text-white"
                    : "bg-white border-gray-300 hover:bg-gray-200 text-black"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center pt-4">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-400 text-black text-sm transition"
          >
            ← 戻る
          </button>
        )}
        <button
          onClick={() => onSubmit(answers)}
          className="px-8 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg transition shadow-md"
        >
          次へ進む
        </button>
      </div>
    </div>
  );
}
