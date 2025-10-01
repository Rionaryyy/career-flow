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
    options: [
      "絶対に嫌（縛りなしが前提）",
      "できれば避けたいが内容次第",
      "気にしない（条件次第でOK）",
    ],
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

  const answeredCount = questions.filter(
    (q) => answers[q.id as keyof typeof answers]
  ).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-start py-8 overflow-x-hidden">
      {/* 進捗バー */}
      <div className="w-full px-4 mb-6">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-2 bg-pink-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          {answeredCount} / {questions.length} 問回答済み
        </p>
      </div>

      {/* タイトル */}
      <h2 className="text-2xl font-bold text-black mb-8 text-center px-4">
        📍 フェーズ①：前提条件
      </h2>

      {/* 質問カード一覧 */}
      <div className="w-full px-2 space-y-5">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="w-full bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl shadow-lg p-5 transition hover:shadow-xl"
          >
            <p className="text-lg font-semibold text-center text-black mb-4">
              {index + 1}. {q.question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(q.id, option)}
                  className={`w-full py-3 rounded-xl border transition-all text-black text-base ${
                    answers[q.id as keyof typeof answers] === option
                      ? "bg-pink-300 border-pink-400 shadow-md scale-[1.02]"
                      : "bg-white border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ナビゲーションボタン */}
      <div className="w-full flex justify-between items-center mt-10 px-4">
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-full bg-purple-100 hover:bg-purple-200 text-black text-sm transition"
          >
            ← 戻る
          </button>
        )}
        <button
          onClick={() => onSubmit(answers)}
          className="px-10 py-3 rounded-full bg-pink-400 hover:bg-pink-500 text-black font-semibold text-lg transition shadow-md disabled:opacity-50"
          disabled={answeredCount < questions.length}
        >
          次へ進む →
        </button>
      </div>
    </div>
  );
}
