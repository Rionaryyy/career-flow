"use client";
import React from "react";
import { DiagnosisAnswers } from "@/types/types";

type Phase1Props = {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  onNext: () => void;
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
    id: "qualityPriority",
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
    options: [
      "はい（店舗サポートは不要）",
      "いいえ（店頭での手続きや相談が必要）",
    ],
  },
  {
    id: "contractLockPreference",
    question: "契約期間の縛りや解約金について、どの程度気にしますか？",
    options: [
      "絶対に嫌（縛りなしが前提）",
      "できれば避けたいが内容次第",
      "気にしない（条件次第でOK）",
    ],
  },
];

export default function Phase1({ answers, setAnswers, onNext }: Phase1Props) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <h2 className="text-2xl font-bold text-center text-white">
        📍 フェーズ①：前提条件
      </h2>

      {questions.map((q) => (
        <div
          key={q.id}
          className="rounded-xl p-6 bg-slate-800/60 shadow-md"
        >
          <p className="text-lg font-semibold mb-4 text-white text-center">
            {q.question}
          </p>
          <div className="grid gap-3">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    [q.id]: option,
                  }))
                }
                className={`w-full text-base px-4 py-3 rounded-lg border transition 
                  ${
                    answers[q.id as keyof DiagnosisAnswers] === option
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-500"
                      : "bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-center pt-4">
        <button
          onClick={onNext}
          className="px-10 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition"
        >
          次へ進む
        </button>
      </div>
    </div>
  );
}
